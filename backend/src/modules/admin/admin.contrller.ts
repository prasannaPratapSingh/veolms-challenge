import { Response, Request } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { Course } from "../course/course.model.js";
import { User } from "../user/user.model.js";
import { Enrollment } from "../enrollments/enrollments.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { UserRole } from "../user/user.interface.js";


export const getAanalytics = asyncHandler(async (
    _,
    res: Response
) => {

    const [courses, users, enrollments] = await Promise.all([
        Course.countDocuments(),
        User.countDocuments(),
        Enrollment.countDocuments()
    ])

    res.status(200).json(new ApiResponse(200, "Analytics fetched successfully", { courses, users, enrollments }));

});

export const getStudents = asyncHandler(async (
    _,
    res: Response
) => {

    const getUsers = await User.find({role:UserRole.STUDENT}).select("-password -refreshToken").sort({createdAt:-1});

    return res.status(200).json(new ApiResponse(200, "User data fetched succesfully", getUsers));
    

})