import mongoose, { Schema, Model } from 'mongoose';
import { IEnrollments } from './enrollments.type.js';

const enrollSchema: Schema<IEnrollments> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    enrolledAt: { type: Date, required: true, default: Date.now }

}, { timestamps: true });

export const Enrollment: Model<IEnrollments> = mongoose.model<IEnrollments>("Enrollments", enrollSchema);