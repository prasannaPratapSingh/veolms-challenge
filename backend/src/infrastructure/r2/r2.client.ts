import { S3Client } from "@aws-sdk/client-s3";
import envConfig from "../../config/envConfig.js";

export const r2Client = new S3Client({
    region: "auto",
    endpoint: envConfig.R2_ENDPOINT,
    credentials: {
        accessKeyId: envConfig.R2_ACCESS_KEY,
        secretAccessKey: envConfig.R2_SECRET_KEY
    }
})