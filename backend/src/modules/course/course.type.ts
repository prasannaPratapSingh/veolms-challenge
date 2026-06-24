import { Document, Types } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    createdBy: Types.ObjectId;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
