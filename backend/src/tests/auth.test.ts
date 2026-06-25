import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { createTestUser, generateToken } from "./helpers.js";

describe("Auth", () => {
    describe("POST /api/auth/register", () => {
        it("registers a new user", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "John Doe",
                email: "john@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(201);
            expect(res.body.data.email).toBe("john@example.com");
        });

        it("rejects duplicate email", async () => {
            await createTestUser({ email: "dup@example.com" });
            const res = await request(app).post("/api/auth/register").send({
                name: "John",
                email: "dup@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(400);
        });

        it("rejects missing fields", async () => {
            const res = await request(app).post("/api/auth/register").send({ email: "x@x.com" });
            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        it("logs in with valid credentials and sets cookies", async () => {
            await createTestUser({ email: "login@example.com" });
            const res = await request(app).post("/api/auth/login").send({
                email: "login@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(200);
            expect(res.headers["set-cookie"]).toBeDefined();
        });

        it("rejects wrong password", async () => {
            await createTestUser({ email: "wrong@example.com" });
            const res = await request(app).post("/api/auth/login").send({
                email: "wrong@example.com",
                password: "WrongPass!",
            });
            expect(res.status).toBe(401);
        });

        it("rejects non-existent user", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "ghost@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(404);
        });
    });

    describe("GET /api/auth/get-me", () => {
        it("returns user data with valid token", async () => {
            const user = await createTestUser({ email: "me@example.com" });
            const token = generateToken(user._id.toString());
            const res = await request(app)
                .get("/api/auth/get-me")
                .set("Cookie", [`accessToken=${token}`]);
            expect(res.status).toBe(200);
            expect(res.body.data.email).toBe("me@example.com");
        });

        it("rejects request without token", async () => {
            const res = await request(app).get("/api/auth/get-me");
            expect(res.status).toBe(401);
        });
    });
});
