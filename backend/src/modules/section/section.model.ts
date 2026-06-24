import mongoose, { Schema, Model } from 'mongoose';
import { ISection } from './section.type.js';

const sectionSchema: Schema<ISection> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

sectionSchema.index({ courseId: 1, order: 1 }, { unique: true });

export const Section: Model<ISection> = mongoose.model<ISection>("Section", sectionSchema);
