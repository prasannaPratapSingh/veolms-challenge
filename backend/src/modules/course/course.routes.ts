import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { getAllCourses } from "./course.controller.js";

const router = Router();

router.get("/", authenticateToken, isAdmin, getAllCourses)

export default router;