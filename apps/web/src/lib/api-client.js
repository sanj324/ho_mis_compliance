import axios from "axios";
const accessToken = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
});
