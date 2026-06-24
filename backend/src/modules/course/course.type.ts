import { Document, Types } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    createdBy: string;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUploadCourseBody {
    title: string;
    description: string;
    price: number;
    isPublished?: boolean;
    createdBy:string
}