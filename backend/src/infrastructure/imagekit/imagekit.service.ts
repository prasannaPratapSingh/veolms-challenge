import ApiError from "../../utils/ApiError.js";
import imageKit from "./imagekit.instance.js";

export class ImageKitService {
    /**
   * Uploads a raw file buffer directly from memory to ImageKit
   * @param fileBuffer req.file.buffer from multer
   * @param fileName original name or custom generated name
   */

    public static async uploadBuffer(fileBuffer: Buffer, fileName: string): Promise<string> {
        try {
            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: fileName,
                folder: "/veo/courses/thumbnails"
            })
            return response.url;
        } catch (error: any) {
            throw new ApiError(500, `ImageKit Upload Service Failed: ${error.message || error}`);
        }
    }
}