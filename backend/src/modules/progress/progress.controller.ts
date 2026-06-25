import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Progress } from "./progress.model.js";
import { Lesson } from "../lesson/lesson.model.js";
import { Section } from "../section/section.model.js";

// PATCH /api/progress/lesson/:lessonId/complete
export const completeLesson = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id as string;
    const lessonId = req.params.lessonId as string;

    if (!userId) throw new ApiError(401, "Unauthorized");

    let { courseId } = req.body;
    
    if (!courseId) {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) throw new ApiError(404, "Lesson not found");
        
        const section = await Section.findById(lesson.sectionId);
        if (!section) throw new ApiError(404, "Section not found");
        
        courseId = section.courseId;
    }

    let progress = await Progress.findOne({ userId, lessonId });

    if (progress) {
        progress.completed = true;
        progress.completedAt = new Date();
        await progress.save();
    } else {
        progress = await Progress.create({
            userId: userId as any,
            courseId: courseId as any,
            lessonId: lessonId as any,
            completed: true,
            completedAt: new Date()
        });
    }

    return res.status(200).json(new ApiResponse(200, "Lesson marked as completed", progress));
});

// GET /api/progress/course/:courseId
export const getCourseProgress = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id as string;
    const courseId = req.params.courseId as string;

    if (!userId) throw new ApiError(401, "Unauthorized");

    const progress = await Progress.find({ userId, courseId }).populate("lessonId");

    return res.status(200).json(new ApiResponse(200, "Course progress retrieved successfully", progress));
});

// GET /api/progress/my-progress
export const getMyProgress = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id as string;

    if (!userId) throw new ApiError(401, "Unauthorized");

    const progress = await Progress.find({ userId }).populate("courseId").populate("lessonId");

    return res.status(200).json(new ApiResponse(200, "User progress retrieved successfully", progress));
});
