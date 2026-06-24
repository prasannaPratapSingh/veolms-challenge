import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();


const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new ApiError(400, "Only images files are allowed!"), false);
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
})