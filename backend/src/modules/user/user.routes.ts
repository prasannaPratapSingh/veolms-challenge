import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { getAllEnrollments, getProfile } from "./user.controller.js";

const router = Router();

router.get("/", authenticateToken, getProfile);
router.get("/getEnrollments", authenticateToken, getAllEnrollments);

// api endpoint to create -- patch to update the profile...

export default router;