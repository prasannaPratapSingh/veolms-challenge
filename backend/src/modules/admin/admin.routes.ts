import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { getAanalytics, getStudents } from "./admin.contrller.js";

const router = Router();


router.get("/dashboard", authenticateToken, isAdmin, getAanalytics);
router.get("/students",authenticateToken,isAdmin,getStudents);

export default router;