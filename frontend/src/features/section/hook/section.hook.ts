import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
    setSections, addSection, updateSectionInState, reorderSections, removeSectionFromState, setLoading, setError
} from "../state/section.slice";
import type { Section } from "../state/section.slice";
import {
    createSection as createSectionSvc,
    getSectionsByCourse as getSectionsByCoursesSvc,
    updateSection as updateSectionSvc,
    deleteSection as deleteSectionSvc,
    reorderSections as reorderSectionsSvc,
} from "../service/section.service";

export const useSection = () => {
    const dispatch = useDispatch();

    const handleGetSectionsByCourse = useCallback(async (courseId: string) => {
        try {
            dispatch(setLoading(true));
            const data = await getSectionsByCoursesSvc(courseId);
            dispatch(setSections({ courseId, sections: data?.data || [] }));
            return data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to fetch sections";
            dispatch(setError(msg));
            toast.error(msg);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateSection = useCallback(async (courseId: string, payload: { title: string; order: number }) => {
        try {
            const data = await createSectionSvc({ ...payload, courseId });
            if (data?.data) dispatch(addSection({ courseId, section: data.data }));
            toast.success("Section created!");
            return data?.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to create section";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    const handleUpdateSection = useCallback(async (courseId: string, sectionId: string, payload: Partial<{ title: string; order: number }>) => {
        try {
            const data = await updateSectionSvc(sectionId, payload);
            if (data?.data) dispatch(updateSectionInState({ courseId, section: data.data }));
            toast.success("Section updated!");
            return data?.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to update section";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    const handleDeleteSection = useCallback(async (courseId: string, sectionId: string) => {
        try {
            await deleteSectionSvc(sectionId);
            dispatch(removeSectionFromState({ courseId, sectionId }));
            toast.success("Section deleted!");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to delete section";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    /**
     * Drag-to-reorder sections: optimistically update Redux then persist
     * via a single bulk reorder API call (avoids unique-index conflicts).
     */
    const handleReorderSections = useCallback(async (courseId: string, reordered: Section[]) => {
        const withNewOrder = reordered.map((s, i) => ({ ...s, order: i + 1 }));
        // Optimistic update immediately
        dispatch(reorderSections({ courseId, sections: withNewOrder }));
        try {
            await reorderSectionsSvc(withNewOrder.map(s => ({ _id: s._id, order: s.order })));
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to save section order";
            toast.error(msg);
            // Re-fetch to restore correct state from DB
            try {
                const data = await getSectionsByCoursesSvc(courseId);
                dispatch(setSections({ courseId, sections: data?.data || [] }));
            } catch {}
        }
    }, [dispatch]);

    return { handleGetSectionsByCourse, handleCreateSection, handleUpdateSection, handleDeleteSection, handleReorderSections };
};
