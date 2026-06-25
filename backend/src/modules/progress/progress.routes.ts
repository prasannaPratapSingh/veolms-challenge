import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { completeLesson, getCourseProgress, getMyProgress } from "./progress.controller.js";

const router = Router();

router.patch("/lesson/:lessonId/complete", authenticateToken, completeLesson);
router.get("/course/:courseId", authenticateToken, getCourseProgress);
router.get("/my-progress", authenticateToken, getMyProgress);

export default router;
