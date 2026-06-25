import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import envConfig from "../../config/envConfig.js"
import { r2Client } from "../../infrastructure/r2/r2.client.js"
import { Readable } from "stream"
import fs from "fs";


// r2 se download karne ke liye hai aur hum stream karenege taaki seamless large videos ko handle kar sake without any extra memory

export const downloadFromR2 = async (key: string, destPath: string): Promise<void> => {
    const command = new GetObjectCommand({
        Bucket: envConfig.R2_RAW_BUCKET,
        Key: key
    })

    const response = await r2Client.send(command);
    const stream = response.Body as Readable;

    await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(destPath);
        stream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
    })
}


// Local file R2 pe upload karo

export const uploadFileToR2 = async (
    localPath: string,
    r2Key: string,
    contentType: string,
    bucket: string
): Promise<void> => {
    const fileBuffer = fs.readFileSync(localPath);

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: contentType,
    });

    await r2Client.send(command);
};


export const uploadStringToR2 = async (
    content: string,
    r2Key: string,
    contentType: string,
    bucket: string
): Promise<void> => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: r2Key,
        Body: Buffer.from(content),
        ContentType: contentType,
    });

    await r2Client.send(command);
};

