import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
    setLessons,
    addLesson,
    updateLessonInState,
    reorderLessons,
    removeLessonFromState,
    addPendingPoll,
    setLoading,
    setError,
} from "../state/lesson.slice";
import type { Lesson } from "../state/lesson.slice";
import {
    createLesson as createLessonSvc,
    getLessonsBySection as getLessonsBySectionSvc,
    updateLesson as updateLessonSvc,
    deleteLesson as deleteLessonSvc,
    getVideoUploadUrl,
    uploadVideoToR2,
    triggerVideoProcessing,
    reorderLessons as reorderLessonsSvc,
    type CreateLessonData,
} from "../service/lesson.service";

export const useLesson = () => {
    const dispatch = useDispatch();

    const handleGetLessonsBySection = useCallback(async (sectionId: string) => {
        try {
            dispatch(setLoading(true));
            const data = await getLessonsBySectionSvc(sectionId);
            dispatch(setLessons({ sectionId, lessons: data?.data || [] }));
            return data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to fetch lessons";
            dispatch(setError(msg));
            toast.error(msg);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateLesson = useCallback(async (payload: CreateLessonData) => {
        try {
            const data = await createLessonSvc(payload);
            if (data?.data) dispatch(addLesson({ sectionId: payload.sectionId, lesson: data.data }));
            toast.success("Lesson created!");
            return data?.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to create lesson";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    const handleUpdateLesson = useCallback(async (sectionId: string, lessonId: string, payload: Partial<CreateLessonData>) => {
        try {
            const data = await updateLessonSvc(lessonId, payload);
            if (data?.data) dispatch(updateLessonInState({ sectionId, lesson: data.data }));
            toast.success("Lesson updated!");
            return data?.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to update lesson";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    const handleDeleteLesson = useCallback(async (sectionId: string, lessonId: string) => {
        try {
            await deleteLessonSvc(lessonId);
            dispatch(removeLessonFromState({ sectionId, lessonId }));
            toast.success("Lesson deleted!");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to delete lesson";
            toast.error(msg);
            throw error;
        }
    }, [dispatch]);

    /**
     * Full 3-step video upload:
     * 1. Get signed URL from backend
     * 2. PUT file directly to R2
     * 3. Trigger processing job on backend
     *
     * After upload, registers the lesson in the global pendingPolls registry
     * so useVideoPolling (mounted at App root) handles all status tracking.
     * This means: concurrent uploads all get polled, and navigation doesn't
     * stop polling.
     */
    const handleVideoUpload = useCallback(async (
        lessonId: string,
        sectionId: string,
        file: File,
        onProgress?: (pct: number) => void
    ): Promise<{ jobId: string }> => {
        const urlData = await getVideoUploadUrl(lessonId, file.name, file.type);
        const { signedUrl, rawKey } = urlData.data;

        await uploadVideoToR2(signedUrl, file, onProgress);

        const processData = await triggerVideoProcessing(lessonId, rawKey, file.name);

        // Mark as queued in Redux immediately
        dispatch(updateLessonInState({
            sectionId,
            lesson: { _id: lessonId, sectionId, processingStatus: "queued", videoUrl: "" } as any,
        }));

        // Register with the global poller (survives navigation, handles concurrency)
        dispatch(addPendingPoll({ lessonId, sectionId }));

        toast.success("Video uploaded! Processing started in the background.");

        return { jobId: processData?.data?.jobId };
    }, [dispatch]);

    /**
     * Drag-to-reorder lessons — single bulk API call to avoid unique-index conflicts.
     */
    const handleReorderLessons = useCallback(async (sectionId: string, reordered: Lesson[]) => {
        const withNewOrder = reordered.map((l, i) => ({ ...l, order: i + 1 }));
        dispatch(reorderLessons({ sectionId, lessons: withNewOrder }));
        try {
            await reorderLessonsSvc(withNewOrder.map(l => ({ _id: l._id, order: l.order })));
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to save lesson order";
            toast.error(msg);
            try {
                const freshData = await getLessonsBySectionSvc(sectionId);
                dispatch(setLessons({ sectionId, lessons: freshData?.data || [] }));
            } catch {}
        }
    }, [dispatch]);

    return {
        handleGetLessonsBySection,
        handleCreateLesson,
        handleUpdateLesson,
        handleDeleteLesson,
        handleVideoUpload,
        handleReorderLessons,
    };
};
