import { Worker } from "bullmq";
import { bullmqRedisOptions } from "../infrastructure/redis/redis.client.js";
import { transcodeProcessor } from "./processors/transcode.processor.js";
import connectDB from "../infrastructure/database/db.js";
import { Lesson } from "../modules/lesson/lesson.model.js";

await connectDB();
console.log("Worker started, waiting for jobs...");

const worker = new Worker(
    "video-transcoding",
    transcodeProcessor,
    {
        connection: bullmqRedisOptions,
        concurrency: 1,
    }
);

worker.on("active", async (job) => {
    console.log(`Processing job ${job.id} — lesson: ${job.data.lessonId}`);
    await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "processing" } });
});

worker.on("progress", (job, progress) => {
    console.log(`Job ${job.id} progress: ${progress}%`);
});

worker.on("completed", async (job) => {
    console.log(`Job ${job.id} completed!`);
    // videoUrl is already saved inside transcodeProcessor — just update status
    await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "done" } });
});

worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
    if (job?.data?.lessonId) {
        await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "failed" } });
    }
});