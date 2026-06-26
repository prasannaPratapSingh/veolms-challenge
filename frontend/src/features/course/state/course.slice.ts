import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CourseState, Course } from "../../../types/course.type";

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null
}

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses = action.payload;
        },
        updateCourseInState: (state, action: PayloadAction<Course>) => {
            const index = state.courses.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
})

export const { setCourses, updateCourseInState, setError, setLoading } = courseSlice.actions;
export default courseSlice.reducer;
