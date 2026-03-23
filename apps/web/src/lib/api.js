import axios from "axios";
import { webEnv } from "./env";
import { syncAuthFromStorage, useAuthStore } from "../features/auth/store/authStore";
export const api = axios.create({
    baseURL: webEnv.apiBaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
});
api.interceptors.request.use((config) => {
    syncAuthFromStorage();
    const token = window.localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }
    }
    return Promise.reject(error);
});
export const downloadFile = async (path, fileName) => {
    syncAuthFromStorage();
    const token = window.localStorage.getItem("accessToken");
    const config = {
        responseType: "blob"
    };
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`
        };
    }
    const response = await api.get(path, config);
    const blobUrl = window.URL.createObjectURL(response.data);
    const link = window.document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
};
