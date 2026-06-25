import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from "../src/modules/auth/auth.routes.js"
import courseRouter from "../src/modules/course/course.routes.js";
import userRouter from "../src/modules/user/user.routes.js";
import sectionRouter from "../src/modules/section/section.routes.js";
import lessonRouter from "../src/modules/lesson/lesson.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/section", sectionRouter);
app.use("/api/lesson", lessonRouter);


app.get("/", asyncHandler(async (_: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "VEO Learning Management System"))
}))


app.use(errorHandler);

export default app;
