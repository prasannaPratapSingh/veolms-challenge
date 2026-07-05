import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from "./modules/auth/auth.routes.js"
import courseRouter from "./modules/course/course.routes.js";
import userRouter from "./modules/user/user.routes.js";
import sectionRouter from "./modules/section/section.routes.js";
import lessonRouter from "./modules/lesson/lesson.routes.js";
import enrollmentRouter from "./modules/enrollments/enrollment.routes.js";
import progressRouter from "./modules/progress/progress.routes.js";
import paymentRouter from "./payment/payment.route.js";
import analyticsRouter from "./modules/admin/admin.routes.js";
import passport from "passport";
import "./config/passport.js";
import envConfig from './config/envConfig.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
    contentSecurityPolicy: false, 
}));

app.use(cors({
    origin: envConfig.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/section", sectionRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", analyticsRouter);


app.get("/", asyncHandler(async (_: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "VEO Learning Management System"))
}))


app.use(errorHandler);

export default app;
