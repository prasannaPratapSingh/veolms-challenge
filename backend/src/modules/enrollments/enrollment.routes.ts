import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { postMyEnrollment, getMyCourses, getCourseEnrollment, getAllCourseEnrollments, deleteEnrollment } from "./authenticate.controller.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

router.post("/", authenticateToken, postMyEnrollment);
router.get("/my-courses", authenticateToken, getMyCourses);
router.get("/course/:courseId", authenticateToken, getCourseEnrollment);
router.get("/course/:courseId/all", authenticateToken, isAdmin, getAllCourseEnrollments);
router.delete("/:enrollmentId", authenticateToken, isAdmin, deleteEnrollment);

export default router;