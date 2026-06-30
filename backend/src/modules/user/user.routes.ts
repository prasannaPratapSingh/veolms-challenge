import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { getAllEnrollments, getProfile, updateProfile } from "./user.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.get("/", authenticateToken, getProfile);
router.get("/getEnrollments", authenticateToken, getAllEnrollments);
router.patch("/updateProfile", upload.single("avatar"), authenticateToken, updateProfile);

// api endpoint to create -- patch to update the profile...

export default router;