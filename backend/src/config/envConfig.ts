import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    DB_URL: string;
    REDIS_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    SALT_VALUE: string
}

const requiredEnvs = ["PORT", "NODE_ENV", "DB_URL", "REDIS_URL", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "SALT_VALUE"];
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
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    SALT_VALUE: process.env.SALT_VALUE as string
};

export default envConfig;