import app from './app.js';
import connectDB from './infrastructure/database/db.js';
import connectRedis from './infrastructure/redis/redis.js';
import logger from './utils/logger.js';

const port = process.env.PORT || 3000;

// ── Start Express ──────────────────────────────────────────────────────────
// The BullMQ worker runs as a completely separate process.
// Start it independently with: npm run worker:dev  (dev)  or  npm run worker (prod)
app.listen(port, async () => {
    await connectDB();
    await connectRedis();
    logger.info(`Server is running at http://localhost:${port}`);
});
