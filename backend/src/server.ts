import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import app from './app.js';
import connectDB from './infrastructure/database/db.js';
import connectRedis from './infrastructure/redis/redis.js';
import logger from './utils/logger.js';

const port = process.env.PORT || 3000;

// ── Spawn the BullMQ worker as a separate process ──────────────────────────
// Resolves the worker entry file relative to this file so it works regardless
// of cwd. tsx handles TypeScript execution in dev; node dist/ handles prod.
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const workerPath = path.join(__dirname, "worker", "worker.ts");

const isDev = process.env.NODE_ENV !== "production";

const workerProcess = isDev
    ? spawn("tsx", [workerPath], { stdio: "inherit", shell: false })
    : spawn("node", [workerPath.replace(".ts", ".js")], { stdio: "inherit", shell: false });

workerProcess.on("error", (err) => {
    logger.error(`[Worker] Failed to start: ${err.message}`);
});

workerProcess.on("exit", (code, signal) => {
    if (code !== 0) {
        logger.warn(`[Worker] Exited with code ${code} / signal ${signal}. It will NOT be auto-restarted — check logs.`);
    }
});

// Cleanly shut down the worker when the main process exits
process.on("exit", () => workerProcess.kill());
process.on("SIGINT",  () => { workerProcess.kill("SIGINT");  process.exit(0); });
process.on("SIGTERM", () => { workerProcess.kill("SIGTERM"); process.exit(0); });

// ── Start Express ──────────────────────────────────────────────────────────
app.listen(port, async () => {
    await connectDB();
    await connectRedis();
    logger.info(`Server is running at http://localhost:${port}`);
    logger.info(`Worker process spawned (pid: ${workerProcess.pid})`);
});
