import mongoose, { Schema, Model } from 'mongoose';
import { IEnrollments } from './enrollments.type.js';

const enrollSchema: Schema<IEnrollments> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true,
    },
    enrolledAt: { type: Date, required: true, default: Date.now }

}, { timestamps: true });

enrollSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
)

export const Enrollment: Model<IEnrollments> = mongoose.model<IEnrollments>("Enrollment", enrollSchema);