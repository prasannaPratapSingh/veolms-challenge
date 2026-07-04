import { Worker } from "bullmq";
import { bullmqRedisOptions } from "../infrastructure/redis/redis.client.js";
import { transcodeProcessor } from "./processors/transcode.processor.js";
import connectDB from "../infrastructure/database/db.js";
import { Lesson } from "../modules/lesson/lesson.model.js";
import logger from "../utils/logger.js";

// ── Bootstrap ──────────────────────────────────────────────────────────────
await connectDB();
logger.info("[Worker] Connected to DB. Waiting for jobs...");

const worker = new Worker(
    "video-transcoding",
    transcodeProcessor,
    {
        connection: bullmqRedisOptions,
        concurrency: 1,
    }
);

// ── Job lifecycle events ───────────────────────────────────────────────────
worker.on("active", async (job) => {
    logger.info(`[Worker] Processing job ${job.id} — lesson: ${job.data.lessonId}`);
    await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "processing" } });
});

worker.on("progress", (job, progress) => {
    logger.info(`[Worker] Job ${job.id} progress: ${progress}%`);
});

worker.on("completed", async (job) => {
    logger.info(`[Worker] Job ${job.id} completed`);
    // videoUrl is already saved inside transcodeProcessor — just update status
    await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "done" } });
});

worker.on("failed", async (job, err) => {
    logger.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
    if (job?.data?.lessonId) {
        await Lesson.findByIdAndUpdate(job.data.lessonId, { $set: { processingStatus: "failed" } });
    }
});

worker.on("error", (err) => {
    logger.error(`[Worker] Worker error: ${err.message}`);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────
// Allows any in-progress job to finish before the process exits.
async function shutdown(signal: string) {
    logger.info(`[Worker] Received ${signal}. Closing worker gracefully...`);
    await worker.close();
    logger.info("[Worker] Worker closed. Exiting.");
    process.exit(0);
}

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));