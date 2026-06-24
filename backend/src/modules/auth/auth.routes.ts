import { NextFunction, Request, Response, Router } from "express";
import { register, login, logout, refreshToken, getMe } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { strictAuthLimiter } from "../../middlewares/rateLimiter.midlleware.js";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

router.post("/register", strictAuthLimiter, validateRequest(registerSchema), register)

router.post("/login", strictAuthLimiter, validateRequest(loginSchema), login)

router.post("/logout",strictAuthLimiter,logout);

router.post("/refresh",refreshToken);

router.get("/get-me",authenticateToken,getMe);

export default router;