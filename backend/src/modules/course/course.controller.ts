import { NextFunction, Request, response, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { Course } from "./course.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { IUploadCourseBody } from "./course.type.js";
import { ImageKitService } from "../../infrastructure/imagekit/imagekit.service.js";
import { User } from "../user/user.model.js";
import { UserRole } from "../user/user.interface.js";
import mongoose from "mongoose";


export const getAllCourses = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role
        let courses;
        if (userRole === UserRole.ADMIN) {
            courses = await Course.find();
        } else {
            courses = await Course.find({
                isPublished: true
            })
        }
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
        const courseId = req.params?.courseId;
        const currCourse = await Course.findByIdAndUpdate(courseId,
            { $set: { isPublished: true } },
            { returnDocument: "after" }
        )
        if (!currCourse) {
            throw new ApiError(404, "Error in publishing the course")
        }
        return res.status(200).json(new ApiResponse(200, "Course published successfully", currCourse))
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
        const courseId = req.params?.courseId;

        const currCourse = await Course.findByIdAndUpdate(courseId,
            { $set: { isPublished: false } },
            { returnDocument: "after" }
        )
        if (!currCourse) {
            throw new ApiError(404, "Error in unpublishing the course")
        }
        return res.status(200).json(new ApiResponse(200, "Course unpublished successfully", currCourse))
    } catch (error) {
        next(error);
    }

})

export const getCourseDetails = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;
        const currUser = await User.findById(req.user?.id);
        const userRole = currUser?.role;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        if (userRole !== UserRole.ADMIN && !course.isPublished) {
            throw new ApiError(403, "Access denied");
        }

        return res.status(200).json(new ApiResponse(200, "Course details fetched successfully", course));
    } catch (error) {
        next(error);
    }
})

export const deleteCourse = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Course deleted successfully",
            course
        )
    );
});

export const updateCourse = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;
        const { title, description, price, isPublished, createdBy } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (isPublished !== undefined) updateData.isPublished = isPublished;
        if (createdBy !== undefined) updateData.createdBy = createdBy;

        if (req.file) {
            const educatorName = createdBy || course.createdBy;
            const fileName = `course-thumbnail-${educatorName}-${Date.now()}`;
            const cdnImageUrl = await ImageKitService.uploadBuffer(req.file.buffer, fileName);
            updateData.thumbnail = cdnImageUrl;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!updatedCourse) {
            throw new ApiError(404, "Error in updating course");
        }

        return res.status(200).json(new ApiResponse(200, "Course updated successfully", updatedCourse));
    } catch (error) {
        next(error);
    }
})


export const getCourseContent = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const courseId = req.params.courseId as string;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid course id");
    }

    const pipeline: mongoose.PipelineStage[] = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $lookup: {
                from: "sections",
                let: {
                    courseId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$courseId", "$$courseId"],
                            },
                        },
                    },
                    {
                        $sort: {
                            order: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "lessons",
                            let: {
                                sectionId: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$sectionId", "$$sectionId"],
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        order: 1,
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        title: 1,
                                        description: 1,
                                        videoUrl: 1,
                                        duration: 1,
                                        isPreview: 1,
                                        order: 1,
                                    },
                                },
                            ],
                            as: "lessons",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            order: 1,
                            lessons: 1,
                        },
                    },
                ],
                as: "sections",
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                price: 1,
                category: 1,
                level: 1,
                isPublished: 1,
                sections: 1,
            },
        },
    ];

    const result = await Course.aggregate(pipeline);

    if (!result.length) {
        throw new ApiError(404, "Course not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Course content fetched successfully",
            result[0]
        )
    );
});