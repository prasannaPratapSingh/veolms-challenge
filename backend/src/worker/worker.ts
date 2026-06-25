import { Worker } from "bullmq";
import { bullmqRedisOptions } from "../infrastructure/redis/redis.client.js";
import { transcodeProcessor } from "./processors/transcode.processor.js";
import connectDB from "../infrastructure/database/db.js";

await connectDB();
console.log("Worker started, waiting for jobs...");

const worker = new Worker(
    "video-transcoding",
    transcodeProcessor,
    {
        connection: bullmqRedisOptions,
        concurrency: 1, // ek saath 2 videos process kar sakta hai
    }
);

worker.on("active", (job) => {
    console.log(`Processing job ${job.id} — lesson: ${job.data.lessonId}`);
});

worker.on("progress", (job, progress) => {
    console.log(`Job ${job.id} progress: ${progress}%`);
});

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});