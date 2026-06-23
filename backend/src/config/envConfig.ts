import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    DB_URL: string;
    REDIS_URL: string;
}

const requiredEnvs = ["PORT", "NODE_ENV", "DB_URL", "REDIS_URL"];
const missingEnvs: string[] = [];

requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        missingEnvs.push(env);
    }
});

if (missingEnvs.length > 0) {
    logger.error(`[FATAL ERROR]: Missing required environment variables: ${missingEnvs.join(", ")}`);
    logger.error("Shutting down the server immediately due to incomplete configuration.");
    process.exit(1);
}

const envConfig: EnvConfig = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV as string,
    DB_URL: process.env.DB_URL as string,
    REDIS_URL: process.env.REDIS_URL as string,
};

export default envConfig;