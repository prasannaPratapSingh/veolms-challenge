import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from "../src/modules/auth/auth.routes.js"
import courseRouter from "../src/modules/course/course.routes.js";
import userRouter from "../src/modules/user/user.routes.js";
import sectionRouter from "../src/modules/section/section.routes.js";
import lessonRouter from "../src/modules/lesson/lesson.routes.js";
import enrollmentRouter from "../src/modules/enrollments/enrollment.routes.js";
import progressRouter from "../src/modules/progress/progress.routes.js";
import paymentRouter from "../src/payment/payment.route.js";
import analyticsRouter from "../src/modules/admin/admin.routes.js";

dotenv.config();

const app = express();

// Security headers — must be before other middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow ImageKit/R2 media to load
    contentSecurityPolicy: false, // disable CSP here — configure separately if needed
}));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
