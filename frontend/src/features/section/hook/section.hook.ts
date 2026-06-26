import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
    setSections, addSection, updateSectionInState, removeSectionFromState, setLoading, setError
} from "../state/section.slice";
import {
    createSection as createSectionSvc,
    getSectionsByCourse as getSectionsByCoursesSvc,
    updateSection as updateSectionSvc,
    deleteSection as deleteSectionSvc,
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

    return { handleGetSectionsByCourse, handleCreateSection, handleUpdateSection, handleDeleteSection };
};
