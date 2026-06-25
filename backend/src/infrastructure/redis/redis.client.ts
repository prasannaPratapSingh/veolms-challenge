import { Redis } from "ioredis";
import envConfig from "../../config/envConfig.js";

// Redis instance for direct use (e.g. caching)
export const redisConnection = new Redis(envConfig.REDIS_URL, {
    maxRetriesPerRequest: null
});

// Plain connection options for BullMQ
// BullMQ bundles its own ioredis, so passing an instance causes type conflicts.
// Passing a plain options object lets BullMQ create its own connection internally.
export const bullmqRedisOptions = {
    url: envConfig.REDIS_URL,
    maxRetriesPerRequest: null as null,
};
