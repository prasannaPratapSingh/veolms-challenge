import { NextFunction, Request, response, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { Course } from "./course.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { IUploadCourseBody } from "./course.type.js";
import { ImageKitService } from "../../infrastructure/imagekit/imagekit.service.js";

export const getAllCourses = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const courses = await Course.find();

        if (!courses) {
            throw new ApiError(404, "Error fetching the courses.")
        }

        return res.status(200).json(new ApiResponse(200, "Courses fetched successfully", courses))


    } catch (error) {
        next(error);
    }


})

export const uploadCourse = asyncHandler(async (
    req: Request<{}, {}, IUploadCourseBody>,
    res: Response,
    next: NextFunction
) => {

    try {

        let { title, description, isPublished, price, createdBy } = req.body;

        if (!title || !description || !price || !createdBy) {
            throw new ApiError(400, "All fields are required");
        }

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // yaha se cloudinary pe file upload karege...

        if (!req.file) {
            throw new ApiError(400, "Please provide an avatar image file.");
        }

        const fileName = `course-thumbnail-${createdBy}-${Date.now()}`;

        const cdnImageUrl = await ImageKitService.uploadBuffer(req.file.buffer, fileName);

        const newCourse = new Course({
            title,
            description,
            thumbnail: cdnImageUrl,
            price,
            createdBy
        });
        await newCourse.save();
        return res.status(201).json(new ApiResponse(201, "Course uploaded successfully", newCourse));

    } catch (error) {
        next(error);
    }

})

export const publishCourse = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

    } catch (error) {
        next(error);
    }

})

export const unPublishCourse = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

    } catch (error) {
        next(error);
    }

})