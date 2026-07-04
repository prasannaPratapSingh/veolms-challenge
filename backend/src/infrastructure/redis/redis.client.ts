import envConfig from "../../config/envConfig.js";

// Single shared ioredis instance — re-exported for direct use (e.g. caching, blacklisting)
export { redisClient as redisConnection } from "./redis.js";

// Plain connection options for BullMQ.
// BullMQ manages its own internal ioredis connection; passing a URL options
// object is the cleanest way to avoid sharing a connection across concerns.
export const bullmqRedisOptions = {
    url: envConfig.REDIS_URL,
    maxRetriesPerRequest: null as null,
};
