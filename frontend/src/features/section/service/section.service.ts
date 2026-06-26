import axiosInstance from "../../../lib/authInstance";

export const createSection = async (data: { title: string; courseId: string; order: number }) => {
    const response = await axiosInstance.post('/section/', data);
    return response.data;
};

export const getSectionsByCourse = async (courseId: string) => {
    const response = await axiosInstance.get(`/section/course/${courseId}`);
    return response.data;
};

export const updateSection = async (sectionId: string, data: Partial<{ title: string; order: number }>) => {
    const response = await axiosInstance.patch(`/section/${sectionId}`, data);
    return response.data;
};

export const deleteSection = async (sectionId: string) => {
    const response = await axiosInstance.delete(`/section/${sectionId}`);
    return response.data;
};
