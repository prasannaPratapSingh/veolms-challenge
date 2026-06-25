import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { vi, beforeAll, afterAll, afterEach } from "vitest";

// Mock envConfig before any imports
vi.mock("../config/envConfig.js", () => ({
    default: {
        PORT: 5000,
        NODE_ENV: "test",
        DB_URL: "mongodb://localhost:27017/test",
        REDIS_URL: "redis://localhost:6379",
        ACCESS_TOKEN_SECRET: "test_access_secret",
        REFRESH_TOKEN_SECRET: "test_refresh_secret",
        SALT_VALUE: "10",
        IMAGEKIT_PUBLIC_KEY: "test",
        IMAGEKIT_PRIVATE_KEY: "test",
        R2_ENDPOINT: "test",
        R2_ACCESS_KEY: "test",
        R2_SECRET_KEY: "test",
        R2_RAW_BUCKET: "test",
        R2_PUBLIC_URL: "test",
        R2_HLS_BUCKET: "test",
        RAZORPAY_KEY_ID: "test_key_id",
        RAZORPAY_KEY_SECRET: "test_key_secret",
    },
}));

// Mock rate limiters
vi.mock("../middlewares/rateLimiter.midlleware.js", () => {
    const passThrough = (_req: any, _res: any, next: any) => next();
    return {
        strictAuthLimiter: passThrough,
        moderateAuthLimiter: passThrough,
        generalApiLimiter: passThrough,
    };
});

// Mock redis
vi.mock("../infrastructure/redis/redis.js", () => ({
    redisClient: {
        get: vi.fn().mockResolvedValue(null),
        setEx: vi.fn().mockResolvedValue("OK"),
        connect: vi.fn().mockResolvedValue(undefined),
    },
    connectRedis: vi.fn().mockResolvedValue(undefined),
    default: vi.fn().mockResolvedValue(undefined),
}));

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});
