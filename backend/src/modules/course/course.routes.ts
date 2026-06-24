import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { getAllCourses, publishCourse, unPublishCourse, uploadCourse, getCourseDetails, deleteCourse, updateCourse } from "./course.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { uploadCourseSchema, updateCourseSchema } from "./course.validation.js";

const router = Router();

router.get("/", authenticateToken, getAllCourses);
router.post("/upload-course", authenticateToken, isAdmin, upload.single("thumbnail"), validateRequest(uploadCourseSchema), uploadCourse);
router.patch("/:courseId/publish", authenticateToken, isAdmin, publishCourse);
router.patch("/:courseId/unPublish", authenticateToken, isAdmin, unPublishCourse);
router.get("/:courseId", authenticateToken, getCourseDetails);
router.delete("/:courseId", authenticateToken, isAdmin, deleteCourse);
router.patch("/:courseId", authenticateToken, isAdmin, upload.single("thumbnail"), validateRequest(updateCourseSchema), updateCourse);

export default router;