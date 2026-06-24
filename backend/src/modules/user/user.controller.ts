import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { User } from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Enrollment } from "../enrollments/enrollments.model.js";

export const getProfile = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const id = req.user.id;

        const user = await User.findById(id).select("-password")

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));

    } catch (error) {
        next(error);
    }


})

export const getAllEnrollments = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const id = req.user?.id;

        const currUser = await User.findById(id);

        if (!currUser) {
            throw new ApiError(404, "User not found");
        }

        const coursesEnrolled = await Enrollment.find({ userId: currUser._id }).populate("courseId", "title, thumbnail")

        return res.status(200).json(new ApiResponse(200, "courses enrolled fetched successfully", coursesEnrolled))

    } catch (error) {
        next(error);
    }

})

