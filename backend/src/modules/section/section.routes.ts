import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { createSectionSchema, updateSectionSchema } from "./section.validation.js";
import {
    createSection,
    getSectionById,
    updateSection,
    deleteSection,
    getSectionsByCourse,
    reorderSections
} from "./section.controller.js";

const router = Router();

router.post("/", authenticateToken, isAdmin, validateRequest(createSectionSchema), createSection);
router.put("/reorder", authenticateToken, isAdmin, reorderSections);
router.get("/:sectionId", authenticateToken, getSectionById);
router.patch("/:sectionId", authenticateToken, isAdmin, validateRequest(updateSectionSchema), updateSection);
router.delete("/:sectionId", authenticateToken, isAdmin, deleteSection);
router.get("/course/:courseId", authenticateToken, getSectionsByCourse);

export default router;