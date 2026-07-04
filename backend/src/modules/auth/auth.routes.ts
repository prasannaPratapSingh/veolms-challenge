import { NextFunction, Request, Response, Router } from "express";
import { register, login, logout, refreshToken, getMe, googleAuthCallback } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { strictAuthLimiter } from "../../middlewares/rateLimiter.midlleware.js";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import passport from "passport";
import envConfig from "../../config/envConfig.js";

const router = Router();

router.post("/register", strictAuthLimiter, validateRequest(registerSchema), register)

router.post("/login", strictAuthLimiter, validateRequest(loginSchema), login)

router.post("/logout", logout);

router.post("/refresh",refreshToken);

router.get("/get-me",authenticateToken,getMe);

router.get("/google",
    passport.authenticate("google",{
        scope:["profile","email"]
    })
)

router.get("/google/callback",
    passport.authenticate("google",{
        session:false,
        failureRedirect:envConfig.CLIENT_URL
    }),
    googleAuthCallback
)

export default router;