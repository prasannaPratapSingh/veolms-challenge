import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import envConfig from "../config/envConfig.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Course } from "../modules/course/course.model.js";
import { Enrollment } from "../modules/enrollments/enrollments.model.js";
import { Payment } from "./payment.model.js";
import { ICreateOrderBody, IVerifyPaymentBody } from "./payment.type.js";
import { User } from "../modules/user/user.model.js";

class PaymentService {
    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: envConfig.RAZORPAY_KEY_ID,
            key_secret: envConfig.RAZORPAY_KEY_SECRET,
        });
    }

    createOrder = asyncHandler(async (
        req: Request<{}, {}, ICreateOrderBody>,
        res: Response
    ) => {
        const { courseId } = req.body;
        const userId = req.user?.id;

        if (!courseId) throw new ApiError(400, "courseId is required");

        const course = await Course.findOne({ _id: courseId, isPublished: true });
        if (!course) throw new ApiError(404, "Course not found");

        const alreadyEnrolled = await Enrollment.findOne({ userId, courseId });
        if (alreadyEnrolled) throw new ApiError(400, "Already enrolled in this course");

        const existingPayment = await Payment.findOne({ userId, courseId, status: "SUCCESS" });
        if (existingPayment) throw new ApiError(400, "Payment already initiated for this course");

        const order = await this.razorpay.orders.create({
            amount: course.price * 100,
            currency: "INR",
            receipt: `${courseId}_${userId}_${Date.now()}`
        });

        await Payment.create({
            userId,
            courseId,
            razorpayOrderId: order.id,
            amount: course.price,
            currency: "INR",
        });

        return res.status(201).json(new ApiResponse(201, "Order created", {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        }));
    });

    verifyPayment = asyncHandler(async (
        req: Request<{}, {}, IVerifyPaymentBody>,
        res: Response
    ) => {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId } = req.body;
        const userId = req.user?.id;

        const paymentRecord = await Payment.findOne({ razorpayOrderId, userId, courseId });
        if (!paymentRecord) throw new ApiError(404, "Payment record not found");
        if (paymentRecord.status === "SUCCESS") throw new ApiError(400, "Payment already verified");

        const expectedSignature = crypto
            .createHmac("sha256", envConfig.RAZORPAY_KEY_SECRET)
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            await Payment.findOneAndUpdate({ razorpayOrderId }, { status: "FAILED" });
            throw new ApiError(400, "Payment verification failed");
        }

        await Payment.findOneAndUpdate(
            { razorpayOrderId },
            { razorpayPaymentId, status: "SUCCESS", paidAt: new Date() },
            { new: true }
        );

        await User.findByIdAndUpdate(
            { userId, courseId },
            { $addToSet: { coursesEnrolled: courseId } }
        )
        
        await Enrollment.create({ userId, courseId });

        return res.status(200).json(new ApiResponse(200, "Payment verified and enrollment successful"));
    });
}

export default new PaymentService();
