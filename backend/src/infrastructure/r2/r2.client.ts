import { S3Client } from "@aws-sdk/client-s3";
import envConfig from "../../config/envConfig.js";

export const r2Client = new S3Client({
    region: "auto",
    endpoint: envConfig.R2_ENDPOINT,
    credentials: {
        accessKeyId: envConfig.R2_ACCESS_KEY,
        secretAccessKey: envConfig.R2_SECRET_KEY
    },
    // AWS SDK v3 adds x-amz-checksum-* headers by default.
    // R2 doesn't support these in presigned PUT URLs and they cause CORS preflight failures.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
})