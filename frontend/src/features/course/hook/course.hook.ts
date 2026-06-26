import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react";
import { setError, setLoading, setCourses, updateCourseInState } from "../state/course.slice";
import { getAllCourses, uploadCourse, publishCourse, unpublishCourse, updateCourse } from "../service/course.service";
import { toast } from "react-hot-toast";
import type { RootState } from "../../../app/store/app.store";

export const useCourse = () => {

    const dispatch = useDispatch();
    const courses = useSelector((state: RootState) => state.course.courses);
    const loading = useSelector((state: RootState) => state.course.loading);

    const fetchCourses = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getAllCourses();
            dispatch(setCourses(data?.data || []));
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Failed to fetch courses';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Alias for backwards compatibility
    const handleGetAllCourses = fetchCourses;

    const handleUploadCourse = useCallback(async (formData: FormData) => {
        try {
            dispatch(setLoading(true));
            const data = await uploadCourse(formData);
            toast.success("Course uploaded successfully!");
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Course upload failed';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handlePublishToggle = useCallback(async (courseId: string, currentStatus: boolean) => {
        try {
            const data = currentStatus
                ? await unpublishCourse(courseId)
                : await publishCourse(courseId);

            if (data?.data) {
                dispatch(updateCourseInState(data.data));
            }
            toast.success(`Course ${currentStatus ? 'unpublished' : 'published'} successfully!`);
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Failed to toggle course status';
            toast.error(message);
            throw error;
        }
    }, [dispatch]);

    const handleUpdateCourse = useCallback(async (courseId: string, formData: FormData) => {
        try {
            dispatch(setLoading(true));
            const data = await updateCourse(courseId, formData);
            if (data?.data) {
                dispatch(updateCourseInState(data.data));
            }
            toast.success("Course updated successfully!");
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Failed to update course';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { courses, loading, fetchCourses, handleGetAllCourses, handleUploadCourse, handlePublishToggle, handleUpdateCourse };

}
