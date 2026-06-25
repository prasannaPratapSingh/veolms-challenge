import { Document, Types } from 'mongoose';

export interface IProgress extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    lessonId: Types.ObjectId;
    completed: boolean;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
