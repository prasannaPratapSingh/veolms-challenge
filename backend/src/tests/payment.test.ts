import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import crypto from "crypto";
import app from "../app.js";
import { createTestUser, generateToken } from "./helpers.js";
import { Course } from "../modules/course/course.model.js";
import { Payment } from "../payment/payment.model.js";
import { Enrollment } from "../modules/enrollments/enrollments.model.js";

const RAZORPAY_TEST_SECRET = "test_key_secret";

// Mock Razorpay
vi.mock("razorpay", () => {
    const mockOrders = {
        create: vi.fn().mockResolvedValue({
            id: "order_test123",
            amount: 49900,
            currency: "INR",
        }),
    };
    function MockRazorpay() {
        return { orders: mockOrders };
    }
    return { default: MockRazorpay };
});

const makeSignature = (orderId: string, paymentId: string) =>
    crypto.createHmac("sha256", RAZORPAY_TEST_SECRET).update(`${orderId}|${paymentId}`).digest("hex");

describe("Payment", () => {
    let token: string;
    let userId: string;
    let courseId: string;

    beforeEach(async () => {
        const user = await createTestUser({ email: `pay_${Date.now()}@example.com` });
        userId = user._id.toString();
        token = generateToken(userId);

        const course = await Course.create({
            title: "Test Course",
            description: "A test course",
            thumbnail: "http://img.url/thumb.jpg",
            price: 499,
            createdBy: userId,
            isPublished: true,
        });
        courseId = course._id.toString();
    });

    describe("POST /api/payment/create-order", () => {
        it("creates a Razorpay order for a published course", async () => {
            const res = await request(app)
                .post("/api/payment/create-order")
                .set("Cookie", [`accessToken=${token}`])
                .send({ courseId });

            expect(res.status).toBe(201);
            expect(res.body.data.orderId).toBe("order_test123");

            const payment = await Payment.findOne({ userId, courseId });
            expect(payment?.status).toBe("PENDING");
        });

        it("rejects if course is not published", async () => {
            const unpublished = await Course.create({
                title: "Draft",
                description: "Draft course",
                thumbnail: "http://img.url/thumb.jpg",
                price: 199,
                createdBy: userId,
                isPublished: false,
            });
            const res = await request(app)
                .post("/api/payment/create-order")
                .set("Cookie", [`accessToken=${token}`])
                .send({ courseId: unpublished._id.toString() });

            expect(res.status).toBe(404);
        });

        it("rejects if already enrolled", async () => {
            await Enrollment.create({ userId, courseId });
            const res = await request(app)
                .post("/api/payment/create-order")
                .set("Cookie", [`accessToken=${token}`])
                .send({ courseId });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/payment/verify", () => {
        it("verifies payment and creates enrollment", async () => {
            await Payment.create({
                userId,
                courseId,
                razorpayOrderId: "order_test123",
                amount: 499,
                currency: "INR",
            });

            const signature = makeSignature("order_test123", "pay_test456");

            const res = await request(app)
                .post("/api/payment/verify")
                .set("Cookie", [`accessToken=${token}`])
                .send({
                    razorpayOrderId: "order_test123",
                    razorpayPaymentId: "pay_test456",
                    razorpaySignature: signature,
                    courseId,
                });

            expect(res.status).toBe(200);

            const payment = await Payment.findOne({ razorpayOrderId: "order_test123" });
            expect(payment?.status).toBe("SUCCESS");

            const enrollment = await Enrollment.findOne({ userId, courseId });
            expect(enrollment).not.toBeNull();
        });

        it("rejects invalid signature", async () => {
            await Payment.create({
                userId,
                courseId,
                razorpayOrderId: "order_bad123",
                amount: 499,
                currency: "INR",
            });

            const res = await request(app)
                .post("/api/payment/verify")
                .set("Cookie", [`accessToken=${token}`])
                .send({
                    razorpayOrderId: "order_bad123",
                    razorpayPaymentId: "pay_bad456",
                    razorpaySignature: "invalidsignature",
                    courseId,
                });

            expect(res.status).toBe(400);

            const payment = await Payment.findOne({ razorpayOrderId: "order_bad123" });
            expect(payment?.status).toBe("FAILED");
        });
    });
});
