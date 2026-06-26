import { Document, Types } from "mongoose";

export type ProcessingStatus = "idle" | "queued" | "processing" | "done" | "failed";

export interface ILesson extends Document {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    sectionId: Types.ObjectId;
    isPreview: boolean;
    order: number;
    processingStatus: ProcessingStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateLessonBody {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    sectionId: string;
    isPreview?: boolean;
    order?: number;
}
