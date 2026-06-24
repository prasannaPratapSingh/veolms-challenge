import { Document, Types } from "mongoose";

export interface ISection extends Document {
    title: string;
    courseId: Types.ObjectId;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}
