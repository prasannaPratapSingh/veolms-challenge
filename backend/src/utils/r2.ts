import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import envConfig from "../config/envConfig.js";

// R2 requires the S3Client to be configured with the Cloudflare endpoint
export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "veolms-videos";

/**
 * Generates a pre-signed URL for uploading a video to Cloudflare R2.
 * @param fileName The unique file name (e.g., video-123.mp4)
 * @param contentType The mime type (e.g., video/mp4)
 * @returns Pre-signed URL string
 */
export const generateUploadPresignedUrl = async (fileName: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `raw-uploads/${fileName}`,
        ContentType: contentType,
        // Uncomment to strictly enforce file size limits via Content-Length header
        // Conditions: [
        //    ["content-length-range", 0, 5368709120] // Up to 5GB
        // ]
    });

    // URL expires in 15 minutes (900 seconds)
    return await getSignedUrl(r2Client, command, { expiresIn: 900 });
};
