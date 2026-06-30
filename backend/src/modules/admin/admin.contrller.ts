import { Response, Request } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { Course } from "../course/course.model.js";
import { User } from "../user/user.model.js";
import { Enrollment } from "../enrollments/enrollments.model.js";
import { Payment } from "../../payment/payment.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import { UserRole } from "../user/user.interface.js";
import mongoose from "mongoose";

export const getAanalytics = asyncHandler(async (_, res: Response) => {
    const [courses, users, enrollments, earningsAgg] = await Promise.all([
        Course.countDocuments(),
        User.countDocuments(),
        Enrollment.countDocuments(),
        Payment.aggregate([
            { $match: { status: "SUCCESS" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
    ]);

    const totalEarnings = earningsAgg[0]?.total ?? 0;

    res.status(200).json(new ApiResponse(200, "Analytics fetched successfully", {
        courses,
        users,
        enrollments,
        totalEarnings,
    }));
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { role: UserRole.STUDENT };
    if (search?.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [{ name: regex }, { email: regex }];
    }

    const [students, total] = await Promise.all([
        User.find(filter)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    // Attach enrollment count per student
    const studentIds = students.map(s => s._id);
    const enrollmentCounts = await Enrollment.aggregate([
        { $match: { userId: { $in: studentIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    for (const e of enrollmentCounts) countMap[e._id.toString()] = e.count;

    const enriched = students.map(s => ({
        ...s.toObject(),
        enrollmentCount: countMap[s._id.toString()] ?? 0,
    }));

    res.status(200).json(new ApiResponse(200, "Students fetched successfully", {
        students: enriched,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    }));
});

export const getStudentDetail = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new ApiError(400, "Invalid student ID");
    }

    const student = await User.findById(studentId).select("-password -refreshToken");
    if (!student || student.role !== UserRole.STUDENT) {
        throw new ApiError(404, "Student not found");
    }

    const enrollments = await Enrollment.find({ userId: studentId })
        .populate("courseId", "title thumbnail price isPublished")
        .sort({ enrolledAt: -1 });

    res.status(200).json(new ApiResponse(200, "Student detail fetched", {
        student,
        enrollments,
    }));
});

import { Payment } from "../../payment/payment.model.js";

export const removeStudentEnrollment = asyncHandler(async (req: Request, res: Response) => {
    const { studentId, courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid ID");
    }

    const deleted = await Enrollment.findOneAndDelete({ userId: studentId, courseId });
    if (!deleted) throw new ApiError(404, "Enrollment not found");

    // Remove payment records so the user can re-enroll and pay again
    await Payment.deleteMany({ userId: studentId, courseId });

    // Remove the course from the user's coursesEnrolled array
    await User.findByIdAndUpdate(studentId, {
        $pull: { coursesEnrolled: courseId },
    });

    res.status(200).json(new ApiResponse(200, "Enrollment removed", null));
});