import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { getAanalytics, getStudents, getStudentDetail, removeStudentEnrollment } from "./admin.contrller.js";

const router = Router();

router.get("/dashboard", authenticateToken, isAdmin, getAanalytics);
router.get("/students", authenticateToken, isAdmin, getStudents);
router.get("/students/:studentId", authenticateToken, isAdmin, getStudentDetail);
router.delete("/students/:studentId/enrollments/:courseId", authenticateToken, isAdmin, removeStudentEnrollment);

export default router;