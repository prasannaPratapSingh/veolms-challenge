import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "./paymnt.controller.js";

const router = Router();

router.post("/create-order", authenticateToken, createOrder);
router.post("/verify", authenticateToken, verifyPayment);

export default router;
