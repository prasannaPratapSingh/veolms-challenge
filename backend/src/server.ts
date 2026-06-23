import app from './app.js';
import connectDB from './infrastructure/database/db.js';
import connectRedis from './infrastructure/redis/redis.js';
import logger from './utils/logger.js';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB();
  await connectRedis();
  logger.info(`Server is running at http://localhost:${port}`);
});
