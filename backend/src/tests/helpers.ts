import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import hashPass from "../utils/hashPass.js";

const ACCESS_SECRET = "test_access_secret";

export const createTestUser = async (overrides = {}) => {
    const user = await User.create({
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: await hashPass("Password123!"),
        ...overrides,
    });
    return user;
};

export const generateToken = (userId: string) =>
    jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
