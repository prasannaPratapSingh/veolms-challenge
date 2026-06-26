export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    instructor?: any; // Adjust when instructor type is available
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any; // Catch-all for other backend fields
}

export interface CourseState {
    courses: Course[];
    loading: boolean;
    error: string | null;
}
