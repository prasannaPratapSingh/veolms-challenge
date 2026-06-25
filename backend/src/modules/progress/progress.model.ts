import mongoose, { Schema, Model } from 'mongoose';
import { IProgress } from './progress.type.js';

const progressSchema: Schema<IProgress> = new Schema({
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
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
        required: true,
        index: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    }
}, { timestamps: true });

// Ensure a user can only have one progress record per lesson
progressSchema.index(
    { userId: 1, lessonId: 1 },
    { unique: true }
);

export const Progress: Model<IProgress> = mongoose.model<IProgress>("Progress", progressSchema);
