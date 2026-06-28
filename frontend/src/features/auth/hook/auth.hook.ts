import { useDispatch } from "react-redux"
import { useCallback } from "react";
import type { loginBody, registerBody } from "../../../types/auth.type"
import { setError, setLoading, setUser } from "../state/auth.slice";
import { getMeUuser, login, logout, register } from "../service/authService";
import { toast } from "react-hot-toast";

export const useAuth = () => {

    const dispatch = useDispatch();

    const handleRegister = useCallback(async ({ name, email, password }: registerBody) => {
        try {
            dispatch(setLoading(true));
            const data = await register({ name, email, password });
            toast.success("Registration successful! Please login.");
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Registration failed';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }: loginBody) => {
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password });
            dispatch(setUser(data));
            toast.success("Welcome back!");
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Login failed';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            toast.success("Signed out successfully.");
        } catch (error: any) {
            console.error("Logout API failed", error);
            const message = error?.response?.data?.message || error?.message || 'Logout failed';
            dispatch(setError(message));
            toast.error(message);
        } finally {
            dispatch(setUser(null));
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getMeUuser();
            dispatch(setUser(data));
            return data;
        } catch {
            dispatch(setUser(null));
            dispatch(setError(null));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { handleLogin, handleLogout, handleRegister, handleGetMe };

}
