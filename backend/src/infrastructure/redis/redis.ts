import { Redis } from "ioredis";
import envConfig from "../../config/envConfig.js";
import logger from "../../utils/logger.js";

export const redisClient = new Redis(envConfig.REDIS_URL, {
    maxRetriesPerRequest: null,
});

redisClient.on("error", (error: Error) => {
    logger.error(`Redis Client Error: ${error}`);
});

redisClient.on("connect", () => {
    logger.info("Redis connected successfully 📍");
});

// ioredis connects automatically on instantiation.
// This function just validates the connection is alive at startup.
export const connectRedis = async () => {
    try {
        await redisClient.ping();
    } catch (error) {
        logger.error(`Could not connect to Redis: ${error}`);
        process.exit(1);
    }
};

export default connectRedis;
