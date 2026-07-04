import axios from "axios";

let isRefreshing = false;

let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4002/api";

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        // Refresh endpoint ko intercept mat karo
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const errorCode =
            error.response.data?.code ||
            error.response.data?.errorCode;

        const shouldRefresh =
            status === 401 &&
            ["TOKEN_EXPIRED", "TOKEN_MISSING"].includes(errorCode) &&
            !originalRequest._retry;

        if (!shouldRefresh) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4002";
            // IMPORTANT: normal axios use karo
            await axios.post(
                `${backendUrl}/api/auth/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );

            processQueue();

            return axiosInstance(originalRequest);

        } catch (refreshError) {

            processQueue(refreshError);

            // App ko bata do auth fail ho gaya
            window.dispatchEvent(new CustomEvent("auth:logout"));

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;
