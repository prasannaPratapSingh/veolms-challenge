import { Types } from "mongoose";

export interface IEnrollments {
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
    enrolledAt: Date
}

