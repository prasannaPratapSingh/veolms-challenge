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

export interface PendingPoll {
    lessonId: string;
    sectionId: string;
}

interface LessonState {
    // keyed by sectionId
    lessonsBySection: Record<string, Lesson[]>;
    // registry of lessons currently being polled
    pendingPolls: PendingPoll[];
    loading: boolean;
    error: string | null;
}

const initialState: LessonState = {
    lessonsBySection: {},
    pendingPolls: [],
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
        updateLessonInState: (state, action: PayloadAction<{ sectionId: string; lesson: Partial<Lesson> & { _id: string } }>) => {
            const { sectionId, lesson } = action.payload;
            const list = state.lessonsBySection[sectionId] || [];
            const idx = list.findIndex(l => l._id === lesson._id);
            if (idx !== -1) list[idx] = { ...list[idx], ...lesson };
            state.lessonsBySection[sectionId].sort((a, b) => a.order - b.order);
        },
        reorderLessons: (state, action: PayloadAction<{ sectionId: string; lessons: Lesson[] }>) => {
            state.lessonsBySection[action.payload.sectionId] = action.payload.lessons;
        },
        removeLessonFromState: (state, action: PayloadAction<{ sectionId: string; lessonId: string }>) => {
            const { sectionId, lessonId } = action.payload;
            if (state.lessonsBySection[sectionId]) {
                state.lessonsBySection[sectionId] = state.lessonsBySection[sectionId].filter(l => l._id !== lessonId);
            }
            // Also remove from polling registry
            state.pendingPolls = state.pendingPolls.filter(p => p.lessonId !== lessonId);
        },
        // Register a lesson for global polling
        addPendingPoll: (state, action: PayloadAction<PendingPoll>) => {
            const already = state.pendingPolls.some(p => p.lessonId === action.payload.lessonId);
            if (!already) state.pendingPolls.push(action.payload);
        },
        // Remove a lesson from global polling (done or failed)
        removePendingPoll: (state, action: PayloadAction<string>) => {
            state.pendingPolls = state.pendingPolls.filter(p => p.lessonId !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    },
});

export const {
    setLessons,
    addLesson,
    updateLessonInState,
    reorderLessons,
    removeLessonFromState,
    addPendingPoll,
    removePendingPoll,
    setLoading,
    setError,
} = lessonSlice.actions;
export default lessonSlice.reducer;
