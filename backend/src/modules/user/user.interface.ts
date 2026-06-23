import { Document } from 'mongoose';

export enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER"
}

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    avatarUrl: string;
    refreshToken: string | null;
    role: UserRole;
    coursesEnrolled: string[];
}

