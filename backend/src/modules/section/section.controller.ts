import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Section } from "./section.model.js";
import { Course } from "../course/course.model.js";
import { User } from "../user/user.model.js";
import { UserRole } from "../user/user.interface.js";

export const createSection = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, courseId, order } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const existingSection = await Section.findOne({ courseId, order: order ?? 0 });
        if (existingSection) {
            throw new ApiError(400, `A section with order ${order ?? 0} already exists in this course.`);
        }

        const newSection = new Section({
            title,
            courseId,
            order: order ?? 0
        });

        await newSection.save();

        return res.status(201).json(new ApiResponse(201, "Section created successfully", newSection));
    } catch (error: any) {
        if (error.code === 11000) {
            return next(new ApiError(400, "A section with this order already exists in the course."));
        }
        next(error);
    }
});

export const getSectionById = asyncHandler(async (
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

        const course = await Course.findById(section.courseId);
        if (!course) {
            throw new ApiError(404, "Associated course not found");
        }

        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role;

        if (userRole !== UserRole.ADMIN && !course.isPublished) {
            throw new ApiError(403, "Access denied");
        }

        return res.status(200).json(new ApiResponse(200, "Section details fetched successfully", section));
    } catch (error) {
        next(error);
    }
});

export const updateSection = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sectionId } = req.params;
        const { title, courseId, order } = req.body;

        const section = await Section.findById(sectionId);
        if (!section) {
            throw new ApiError(404, "Section not found");
        }

        const targetCourseId = courseId || section.courseId;
        const targetOrder = order !== undefined ? order : section.order;

        if (order !== undefined || courseId !== undefined) {
            const existingSection = await Section.findOne({
                _id: { $ne: sectionId },
                courseId: targetCourseId,
                order: targetOrder
            });
            if (existingSection) {
                throw new ApiError(400, `A section with order ${targetOrder} already exists in this course.`);
            }
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (order !== undefined) updateData.order = order;

        if (courseId !== undefined) {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new ApiError(404, "Associated course not found");
            }
            updateData.courseId = courseId;
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!updatedSection) {
            throw new ApiError(404, "Error updating section");
        }

        return res.status(200).json(new ApiResponse(200, "Section updated successfully", updatedSection));
    } catch (error: any) {
        if (error.code === 11000) {
            return next(new ApiError(400, "A section with this order already exists in the course."));
        }
        next(error);
    }
});

export const deleteSection = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sectionId } = req.params;

        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            throw new ApiError(404, "Section not found");
        }

        return res.status(200).json(new ApiResponse(200, "Section deleted successfully", deletedSection));
    } catch (error) {
        next(error);
    }
});

export const getSectionsByCourse = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role;

        if (userRole !== UserRole.ADMIN && !course.isPublished) {
            throw new ApiError(403, "Access denied");
        }

        const sections = await Section.find({ courseId }).sort({ order: 1 });

        return res.status(200).json(new ApiResponse(200, "Sections fetched successfully", sections));
    } catch (error) {
        next(error);
    }
});
