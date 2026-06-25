import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { EnrollBody } from "./enrollment.type.js";
import { Course } from "../course/course.model.js";
import { User } from "../user/user.model.js";
import { Enrollment } from "./enrollments.model.js";
import ApiResponse from "../../utils/ApiResponse.js";


export const postMyEnrollment = asyncHandler(async (
    req: Request<{}, {}, EnrollBody>,
    res: Response
) => {

    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const { courseId } = req.body;

    const getCourse = await Course.findById(courseId);

    if (!getCourse) {
        throw new ApiError(404, "Course not found");
    }

    if (!getCourse.isPublished) {
        throw new ApiError(400, "Cannot enroll in an unpublished course");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const checkUserEnrolled = await Enrollment.findOne({ userId, courseId })
    if (checkUserEnrolled) {
        throw new ApiError(409, "User already enrolled in this course");
    }

    const myEnrollment = await Enrollment.create({ courseId, userId });

    return res.status(200).json(new ApiResponse(200, "User successfully enrolled in this course", myEnrollment))

});

export const getMyCourses = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const enrollments = await Enrollment.find({ userId }).populate("courseId");

    return res.status(200).json(new ApiResponse(200, "User's enrolled courses retrieved successfully", enrollments));
});

export const getCourseEnrollment = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId, courseId }).populate("courseId");

    if (!enrollment) {
        throw new ApiError(404, "Enrollment not found");
    }

    return res.status(200).json(new ApiResponse(200, "Enrollment retrieved successfully", enrollment));
});

export const getAllCourseEnrollments = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const { courseId } = req.params;

    if (!courseId) {
        throw new ApiError(400, "Course ID is required");
    }

    const enrollments = await Enrollment.find({ courseId }).populate("userId", "name email");

    return res.status(200).json(new ApiResponse(200, "All course enrollments retrieved successfully", enrollments));
});

export const deleteEnrollment = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const { enrollmentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
        throw new ApiError(404, "Enrollment not found");
    }

    await Enrollment.findByIdAndDelete(enrollmentId);

    return res.status(200).json(new ApiResponse(200, "Enrollment deleted successfully", null));
});
