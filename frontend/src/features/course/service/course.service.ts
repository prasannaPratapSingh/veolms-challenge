import axiosInstance from "../../../lib/authInstance";

export const getAllCourses = async () => {
    try {
        const response = await axiosInstance.get('/course/');
        return response.data;

    } catch (error: any) {
        console.error("Error fetching courses from service layer", error.message);
        throw error;
    }
}

export const getAnalytics = async () => {
    try {
        const response = await axiosInstance.get("/admin/dashboard");
        return response.data;
    } catch (error: any) {
        console.log("Error fetching analaytics from course service layer", error.message);
        throw error;
    }
}

export const uploadCourse = async (data: FormData) => {
    try {
        const response = await axiosInstance.post('/course/upload-course', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error uploading course from service layer", error.message);
    }
}

export const publishCourse = async (courseId: string) => {
    try {
        const response = await axiosInstance.patch(`/course/${courseId}/publish`);
        return response.data;
    } catch (error: any) {
        console.error("Error publishing course from service layer", error.message);
        throw error;
    }
}

export const unpublishCourse = async (courseId: string) => {
    try {
        const response = await axiosInstance.patch(`/course/${courseId}/unPublish`);
        return response.data;
    } catch (error: any) {
        console.error("Error unpublishing course from service layer", error.message);
        throw error;
    }
}

export const updateCourse = async (courseId: string, data: FormData) => {
    try {
        const response = await axiosInstance.patch(`/course/${courseId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating course from service layer", error.message);
        throw error;
    }
}

