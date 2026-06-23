import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import asyncHandler from './utils/asyncHandler.js';
import ApiResponse from './utils/ApiResponse.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", asyncHandler(async (_: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, "VEO Learning Management System"))
}))

export default app;
