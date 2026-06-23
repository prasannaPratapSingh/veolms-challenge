import mongoose from "mongoose";
import envConfig from "../../config/envConfig.js";
import logger from "../../utils/logger.js";

const connectDB = async () => {
    try {
        const connectionInstace = await mongoose.connect(envConfig.DB_URL);
        logger.info(`MongoDB connected: ${connectionInstace.connection.host} 🧸`);
    } catch (error) {
        logger.error("MongoDB connection failed!");
        process.exit(1);
    }
}

export default connectDB;