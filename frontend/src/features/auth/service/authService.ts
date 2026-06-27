import axiosInstance from "../../../lib/authInstance";
import type { loginBody, registerBody } from "../../../types/auth.type";

export const register = async ({ name, email, password }: registerBody) => {
    try {
        const response = await axiosInstance.post('/auth/register', { name, email, password });
        return response.data;
    } catch (error: any) {
        console.error("Error hitting the API from service layer", error.message);
        throw error;
    }
}

export const login = async ({ email, password }: loginBody) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        console.error("Error hitting the login API from service layer", error.message);
        throw error;
    }
}

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    } catch (error: any) {
        console.error("Error hitting the logout API from the service layer", error.message);
        throw error;
    }
}

export const getMeUuser = async () => {
    try {
        const response = await axiosInstance.get('/auth/get-me');
        return response.data;
    } catch (error: any) {
        console.error("Error hitting the get-me API from the service layer", error.message);
        throw error;
    }
}
