import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { getAllCourses, publishCourse, unPublishCourse, uploadCourse } from "./course.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { uploadCourseSchema } from "./course.validation.js";

const router = Router();

router.get("/", authenticateToken, isAdmin, getAllCourses);
router.post("/upload-course", authenticateToken, isAdmin, upload.single("thumbnail"), validateRequest(uploadCourseSchema), uploadCourse);
router.patch("/:courseId/publish", authenticateToken, isAdmin, publishCourse);
router.patch("/:courseId/unpublish", authenticateToken, isAdmin, unPublishCourse);

export default router;