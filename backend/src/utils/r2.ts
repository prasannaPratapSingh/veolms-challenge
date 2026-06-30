import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import envConfig from "../config/envConfig.js";
import { Readable } from "stream";

import { r2Client } from "../infrastructure/r2/r2.client.js";

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

/**
 * Gets a stream for an object in R2.
 * @param key The object key (path) in R2
 * @param bucketName The bucket name (defaults to envConfig.R2_HLS_BUCKET or BUCKET_NAME)
 */
export const streamFromR2 = async (key: string, bucketName: string = envConfig.R2_HLS_BUCKET || BUCKET_NAME) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const response = await r2Client.send(command);
    return response.Body as Readable;
};

/**
 * Gets the contents of a text file from R2.
 * @param key The object key
 * @param bucketName The bucket name
 */
export const getStringFromR2 = async (key: string, bucketName: string = envConfig.R2_HLS_BUCKET || BUCKET_NAME): Promise<string> => {
    const stream = await streamFromR2(key, bucketName);
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("error", (err) => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
};
