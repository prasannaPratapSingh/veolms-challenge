import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Section {
    _id: string;
    title: string;
    courseId: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

interface SectionState {
    // keyed by courseId so multiple courses don't collide
    sectionsByCourse: Record<string, Section[]>;
    loading: boolean;
    error: string | null;
}

const initialState: SectionState = {
    sectionsByCourse: {},
    loading: false,
    error: null,
};

const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<{ courseId: string; sections: Section[] }>) => {
            state.sectionsByCourse[action.payload.courseId] = action.payload.sections;
        },
        addSection: (state, action: PayloadAction<{ courseId: string; section: Section }>) => {
            const { courseId, section } = action.payload;
            if (!state.sectionsByCourse[courseId]) state.sectionsByCourse[courseId] = [];
            state.sectionsByCourse[courseId].push(section);
            state.sectionsByCourse[courseId].sort((a, b) => a.order - b.order);
        },
        updateSectionInState: (state, action: PayloadAction<{ courseId: string; section: Section }>) => {
            const { courseId, section } = action.payload;
            const list = state.sectionsByCourse[courseId] || [];
            const idx = list.findIndex(s => s._id === section._id);
            if (idx !== -1) list[idx] = section;
            // Re-sort after update so order changes are immediately reflected
            state.sectionsByCourse[courseId].sort((a, b) => a.order - b.order);
        },
        reorderSections: (state, action: PayloadAction<{ courseId: string; sections: Section[] }>) => {
            state.sectionsByCourse[action.payload.courseId] = action.payload.sections;
        },
        removeSectionFromState: (state, action: PayloadAction<{ courseId: string; sectionId: string }>) => {
            const { courseId, sectionId } = action.payload;
            if (state.sectionsByCourse[courseId]) {
                state.sectionsByCourse[courseId] = state.sectionsByCourse[courseId].filter(s => s._id !== sectionId);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    },
});

export const { setSections, addSection, updateSectionInState, reorderSections, removeSectionFromState, setLoading, setError } = sectionSlice.actions;
export default sectionSlice.reducer;
