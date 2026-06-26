import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ProcessingStatus = "idle" | "queued" | "processing" | "done" | "failed";

export interface Lesson {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    sectionId: string;
    isPreview: boolean;
    order: number;
    processingStatus: ProcessingStatus;
    createdAt: string;
    updatedAt: string;
}

interface LessonState {
    // keyed by sectionId
    lessonsBySection: Record<string, Lesson[]>;
    loading: boolean;
    error: string | null;
}

const initialState: LessonState = {
    lessonsBySection: {},
    loading: false,
    error: null,
};

const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        setLessons: (state, action: PayloadAction<{ sectionId: string; lessons: Lesson[] }>) => {
            state.lessonsBySection[action.payload.sectionId] = action.payload.lessons;
        },
        addLesson: (state, action: PayloadAction<{ sectionId: string; lesson: Lesson }>) => {
            const { sectionId, lesson } = action.payload;
            if (!state.lessonsBySection[sectionId]) state.lessonsBySection[sectionId] = [];
            state.lessonsBySection[sectionId].push(lesson);
            state.lessonsBySection[sectionId].sort((a, b) => a.order - b.order);
        },
        updateLessonInState: (state, action: PayloadAction<{ sectionId: string; lesson: Lesson }>) => {
            const { sectionId, lesson } = action.payload;
            const list = state.lessonsBySection[sectionId] || [];
            const idx = list.findIndex(l => l._id === lesson._id);
            if (idx !== -1) list[idx] = lesson;
        },
        removeLessonFromState: (state, action: PayloadAction<{ sectionId: string; lessonId: string }>) => {
            const { sectionId, lessonId } = action.payload;
            if (state.lessonsBySection[sectionId]) {
                state.lessonsBySection[sectionId] = state.lessonsBySection[sectionId].filter(l => l._id !== lessonId);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    },
});

export const { setLessons, addLesson, updateLessonInState, removeLessonFromState, setLoading, setError } = lessonSlice.actions;
export default lessonSlice.reducer;
