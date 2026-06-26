import axios from "axios";
import axiosInstance from "../../../lib/authInstance";

export interface CreateLessonData {
    title: string;
    description: string;
    duration: number;
    sectionId: string;
    isPreview: boolean;
    order: number;
}

export const createLesson = async (data: CreateLessonData) => {
    const response = await axiosInstance.post('/lesson/', data);
    return response.data;
};

export const getLessonsBySection = async (sectionId: string) => {
    const response = await axiosInstance.get(`/lesson/section/${sectionId}`);
    return response.data;
};

export const updateLesson = async (lessonId: string, data: Partial<CreateLessonData>) => {
    const response = await axiosInstance.patch(`/lesson/${lessonId}`, data);
    return response.data;
};

export const deleteLesson = async (lessonId: string) => {
    const response = await axiosInstance.delete(`/lesson/${lessonId}`);
    return response.data;
};

// Step 1: Get a pre-signed PUT URL from the backend
export const getVideoUploadUrl = async (lessonId: string, fileName: string, fileType: string) => {
    const response = await axiosInstance.get(`/lesson/${lessonId}/upload-url`, {
        params: { fileName, fileType }
    });
    return response.data;
};

// Step 2: Upload the file directly to R2 using clean axios (no auth headers from our interceptor)
export const uploadVideoToR2 = async (
    signedUrl: string,
    file: File,
    onProgress?: (pct: number) => void
) => {
    await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (evt) => {
            if (onProgress && evt.total) {
                onProgress(Math.round((evt.loaded / evt.total) * 100));
            }
        }
    });
};

// Step 3: Trigger the backend FFmpeg / HLS processing job
export const triggerVideoProcessing = async (lessonId: string, rawKey: string, fileName: string) => {
    const response = await axiosInstance.post(`/lesson/${lessonId}/process`, { rawKey, fileName });
    return response.data;
};

// Poll job status — used to know when transcoding finishes
export const getJobStatus = async (lessonId: string) => {
    const response = await axiosInstance.get(`/lesson/${lessonId}/job-status`);
    return response.data;
};
