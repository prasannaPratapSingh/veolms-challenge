import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Lesson } from "./lesson.model.js";
import { Section } from "../section/section.model.js";
import { User } from "../user/user.model.js";
import { UserRole } from "../user/user.interface.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../../infrastructure/r2/r2.client.js";
import { videoQueue } from "../../infrastructure/queue/videoQueue.js";
import envConfig from "../../config/envConfig.js";

export const createLesson = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, description, videoUrl, duration, sectionId, isPreview, order } = req.body;

        const section = await Section.findById(sectionId);
        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        const existingLesson = await Lesson.findOne({ sectionId, order: order ?? 0 });
        if (existingLesson) {
            throw new ApiError(400, `A lesson with order ${order ?? 0} already exists in this section.`);
        }

        const newLesson = new Lesson({
            title,
            description,
            videoUrl,
            duration,
            sectionId,
            isPreview: isPreview ?? false,
            order: order ?? 0
        });

        await newLesson.save();

        return res.status(201).json(new ApiResponse(201, "Lesson created successfully", newLesson));
    } catch (error) {
        next(error);
    }
});

export const getLessonById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw new ApiError(404, "Lesson not found");
        }

        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role;

        if (userRole !== UserRole.ADMIN && !lesson.isPreview) {
            throw new ApiError(403, "Access denied. This lesson is not a free preview.");
        }

        return res.status(200).json(new ApiResponse(200, "Lesson details fetched successfully", lesson));
    } catch (error) {
        next(error);
    }
});

export const updateLesson = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { lessonId } = req.params;
        const { title, description, videoUrl, duration, sectionId, isPreview, order } = req.body;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw new ApiError(404, "Lesson not found");
        }

        const targetSectionId = sectionId || lesson.sectionId;
        const targetOrder = order !== undefined ? order : lesson.order;

        if (order !== undefined || sectionId !== undefined) {
            const existingLesson = await Lesson.findOne({
                _id: { $ne: lessonId },
                sectionId: targetSectionId,
                order: targetOrder
            });
            if (existingLesson) {
                throw new ApiError(400, `A lesson with order ${targetOrder} already exists in this section.`);
            }
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
        if (duration !== undefined) updateData.duration = duration;
        if (isPreview !== undefined) updateData.isPreview = isPreview;
        if (order !== undefined) updateData.order = order;

        if (sectionId !== undefined) {
            const section = await Section.findById(sectionId);
            if (!section) {
                throw new ApiError(404, "Section not found");
            }
            updateData.sectionId = sectionId;
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!updatedLesson) {
            throw new ApiError(404, "Error updating lesson");
        }

        return res.status(200).json(new ApiResponse(200, "Lesson updated successfully", updatedLesson));
    } catch (error) {
        next(error);
    }
});

export const deleteLesson = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { lessonId } = req.params;

        const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
        if (!deletedLesson) {
            throw new ApiError(404, "Lesson not found");
        }

        return res.status(200).json(new ApiResponse(200, "Lesson deleted successfully", deletedLesson));
    } catch (error) {
        next(error);
    }
});

export const getLessonsBySection = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sectionId } = req.params;

        const section = await Section.findById(sectionId);
        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role;

        let lessons;
        if (userRole === UserRole.ADMIN) {
            lessons = await Lesson.find({ sectionId }).sort({ order: 1 });
        } else {
            lessons = await Lesson.find({ sectionId, isPreview: true }).sort({ order: 1 });
        }

        return res.status(200).json(new ApiResponse(200, "Lessons fetched successfully", lessons));
    } catch (error) {
        next(error);
    }
});



// GET /api/lessons/:id/upload-url
export const getVideoUploadUrl = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { fileName, fileType } = req.query as Record<string, string>;

    const rawKey = `raw/${lessonId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: envConfig.R2_RAW_BUCKET,
        Key: rawKey,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    res.json(new ApiResponse(200, "Upload URL ready", { signedUrl, rawKey }));
});


// POST /api/lessons/:id/process  ← frontend calls this after upload
export const triggerProcessing = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { rawKey, fileName } = req.body;

    // Mark lesson as queued immediately so the frontend can reflect it
    await Lesson.findByIdAndUpdate(lessonId, { $set: { processingStatus: "queued" } });

    const job = await videoQueue.add("transcode", {
        rawKey,
        lessonId: lessonId as string,
        fileName,
    });

    res.json(new ApiResponse(200, "Processing started", { jobId: job.id }));
});

// GET /api/lesson/:lessonId/job-status
export const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).select("processingStatus videoUrl");
    if (!lesson) throw new ApiError(404, "Lesson not found");

    res.json(new ApiResponse(200, "Job status fetched", {
        processingStatus: lesson.processingStatus,
        videoUrl: lesson.videoUrl || null,
    }));
});

// PUT /lesson/reorder  — atomically reassign order for all lessons in a section
export const reorderLessons = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { items } = req.body as { items: { _id: string; order: number }[] };

        if (!Array.isArray(items) || items.length === 0) {
            throw new ApiError(400, "items array is required");
        }

        // Step 1: Move all to temp orders to avoid unique-index collisions
        await Lesson.bulkWrite(
            items.map(({ _id }, i) => ({
                updateOne: {
                    filter: { _id },
                    update: { $set: { order: 10000 + i } },
                }
            }))
        );

        // Step 2: Set the actual new orders
        await Lesson.bulkWrite(
            items.map(({ _id, order }) => ({
                updateOne: {
                    filter: { _id },
                    update: { $set: { order } },
                }
            }))
        );

        return res.status(200).json(new ApiResponse(200, "Lessons reordered successfully", null));
    } catch (error) {
        next(error);
    }
});