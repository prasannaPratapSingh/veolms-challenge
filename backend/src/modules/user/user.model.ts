import mongoose, { Schema, Model } from 'mongoose';

import { UserRole, type IUser } from "./user.interface.js";

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, required: false, default: "https://res.cloudinary.com/dvhx3ldwz/image/upload/v1753431847/default-user-avatar_n9m7g8.png" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    refreshToken: { type: String, required: false, default: null },
    role: { type: String, enum: UserRole, default: UserRole.STUDENT },
    coursesEnrolled: { type: [String], default: [] }
}, { timestamps: true })

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);