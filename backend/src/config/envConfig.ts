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
    IMAGEKIT_PUBLIC_KEY: string;
    IMAGEKIT_PRIVATE_KEY: string;
    R2_ENDPOINT: string;
    R2_ACCESS_KEY: string;
    R2_SECRET_KEY: string;
    R2_RAW_BUCKET: string;
    R2_PUBLIC_URL:string;
    R2_HLS_BUCKET:string;
    RAZORPAY_KEY_ID:string;
    RAZORPAY_KEY_SECRET:string;
    GOOGLE_CLIENT_ID:string;
    GOOGLE_CLIENT_SECRET:string;
    GOOGLE_CALLBACK_URL: string;
    CLIENT_URL: string;
}

const requiredEnvs = ["PORT", "NODE_ENV", "DB_URL", "REDIS_URL", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "SALT_VALUE", "IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY", "R2_ENDPOINT", "R2_ACCESS_KEY", "R2_SECRET_KEY", "R2_RAW_BUCKET","R2_PUBLIC_URL","R2_HLS_BUCKET","RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET","GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET"];
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
    SALT_VALUE: process.env.SALT_VALUE as string,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY as string,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY as string,
    R2_ENDPOINT: process.env.R2_ENDPOINT as string,
    R2_ACCESS_KEY: process.env.R2_ACCESS_KEY as string,
    R2_SECRET_KEY: process.env.R2_SECRET_KEY as string,
    R2_RAW_BUCKET: process.env.R2_RAW_BUCKET as string,
    R2_PUBLIC_URL:process.env.R2_PUBLIC_URL as string,
    R2_HLS_BUCKET:process.env.R2_HLS_BUCKET as string,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID as string,
    RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4002/api/auth/google/callback",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export default envConfig;