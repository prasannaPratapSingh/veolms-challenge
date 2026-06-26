import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
    setLessons, addLesson, updateLessonInState, removeLessonFromState, setLoading, setError
} from "../state/lesson.slice";
import {
    createLesson as createLessonSvc,
    getLessonsBySection as getLessonsBySectionSvc,
    updateLesson as updateLessonSvc,
    deleteLesson as deleteLessonSvc,
    getVideoUploadUrl,
    uploadVideoToR2,
    triggerVideoProcessing,
    getJobStatus,
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
     * 2. PUT file directly to R2 (clean axios, no auth headers)
     * 3. Trigger processing job on backend
     * Immediately marks the lesson as queued in Redux and starts polling.
     */
    const handleVideoUpload = useCallback(async (
        lessonId: string,
        sectionId: string,
        file: File,
        onProgress?: (pct: number) => void
    ): Promise<{ jobId: string }> => {
        // Step 1: Get signed URL
        const urlData = await getVideoUploadUrl(lessonId, file.name, file.type);
        const { signedUrl, rawKey } = urlData.data;

        // Step 2: Upload directly to R2
        await uploadVideoToR2(signedUrl, file, onProgress);

        // Step 3: Trigger processing
        const processData = await triggerVideoProcessing(lessonId, rawKey, file.name);

        // Immediately reflect queued state in Redux — no refresh needed
        dispatch(updateLessonInState({
            sectionId,
            lesson: { _id: lessonId, sectionId, processingStatus: "queued", videoUrl: "" } as any,
        }));

        toast.success("Video uploaded! Processing has started in the background.");

        return { jobId: processData?.data?.jobId };
    }, [dispatch]);

    /**
     * Poll job status every 8 seconds until done or failed.
     * Updates the lesson in Redux so the UI reacts automatically.
     */
    const startPolling = useCallback((lessonId: string, sectionId: string) => {
        const intervalId = setInterval(async () => {
            try {
                const data = await getJobStatus(lessonId);
                const { processingStatus, videoUrl } = data.data;

                // Push the updated fields into the lesson already in Redux
                dispatch(updateLessonInState({
                    sectionId,
                    lesson: {
                        _id: lessonId,
                        sectionId,
                        processingStatus,
                        videoUrl: videoUrl || "",
                        // preserve remaining fields — they are already in the store
                    } as any,
                }));

                if (processingStatus === "done" || processingStatus === "failed") {
                    clearInterval(intervalId);
                    if (processingStatus === "done") {
                        toast.success("Video processing complete!");
                    } else {
                        toast.error("Video processing failed. You can try uploading again.");
                    }
                }
            } catch {
                // silently ignore poll errors — don't spam toasts
            }
        }, 8000);

        return () => clearInterval(intervalId); // return cleanup for useEffect
    }, [dispatch]);

    return {
        handleGetLessonsBySection,
        handleCreateLesson,
        handleUpdateLesson,
        handleDeleteLesson,
        handleVideoUpload,
        startPolling,
    };
};
