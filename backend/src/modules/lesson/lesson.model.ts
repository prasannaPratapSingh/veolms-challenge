import mongoose, { Schema, Model } from "mongoose";
import { ILesson } from "./lesson.type.js";

const lessonSchema: Schema<ILesson> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
        index: true
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    processingStatus: {
        type: String,
        enum: ["idle", "queued", "processing", "done", "failed"],
        default: "idle"
    }
}, { timestamps: true });

lessonSchema.index({ sectionId: 1, order: 1 }, { unique: true });

export const Lesson: Model<ILesson> = mongoose.model<ILesson>("Lesson", lessonSchema);
