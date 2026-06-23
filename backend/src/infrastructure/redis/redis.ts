import { createClient } from 'redis';

import envConfig from '../../config/envConfig.js';
import logger from '../../utils/logger.js';

export const redisClient = createClient({
    url: envConfig.REDIS_URL
});

redisClient.on('error', (error: Error) => {
    logger.error(
        `Redis Client Error: ${error}`
    );
});

redisClient.on('connect', () => {
    logger.info(
        'Redis connected successfully 📍'
    );
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error(
            `Could not connect to Redis: ${error}`
        );

        process.exit(1);
    }
};

export default connectRedis;