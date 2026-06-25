import { Queue } from "bullmq";
import { bullmqRedisOptions } from "../redis/redis.client.js";

export interface TranscodeJobData {
    rawKey: string,
    lessonId: string,
    fileName: string
}

export const videoQueue = new Queue<TranscodeJobData>("video-transcoding", {
    connection: bullmqRedisOptions,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 50,  
        removeOnFail: 50,
    },
});