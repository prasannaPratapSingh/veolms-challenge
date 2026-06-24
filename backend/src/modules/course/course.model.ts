import mongoose, { Schema, Model } from 'mongoose';
import { ICourse } from './course.type.js';

const courseSchema: Schema<ICourse> = new Schema({
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
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
