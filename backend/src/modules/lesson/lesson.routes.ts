import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { createLessonSchema, updateLessonSchema } from "./lesson.validation.js";
import {
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
    getLessonsBySection,
    getVideoUploadUrl,
    triggerProcessing,
    getJobStatus,
    reorderLessons,
    getInProgressLessons,
} from "./lesson.controller.js";

const router = Router();

router.post("/", authenticateToken, isAdmin, validateRequest(createLessonSchema), createLesson);
router.put("/reorder", authenticateToken, isAdmin, reorderLessons);
router.get("/in-progress", authenticateToken, isAdmin, getInProgressLessons);
router.get("/section/:sectionId", authenticateToken, getLessonsBySection);
router.get("/:lessonId", authenticateToken, getLessonById);
router.patch("/:lessonId", authenticateToken, isAdmin, validateRequest(updateLessonSchema), updateLesson);
router.delete("/:lessonId", authenticateToken, isAdmin, deleteLesson);

router.get("/:lessonId/upload-url", authenticateToken, isAdmin, getVideoUploadUrl);
router.post("/:lessonId/process", authenticateToken, isAdmin, triggerProcessing);
router.get("/:lessonId/job-status", authenticateToken, isAdmin, getJobStatus);

export default router;
