import { create } from "zustand";
const getStoredAccessToken = () => window.localStorage.getItem("accessToken");
const getStoredRefreshToken = () => window.localStorage.getItem("refreshToken");
export const useAuthStore = create((set) => ({
    accessToken: getStoredAccessToken(),
    refreshToken: getStoredRefreshToken(),
    user: null,
    setAuth: (payload) => {
        window.localStorage.setItem("accessToken", payload.accessToken);
        window.localStorage.setItem("refreshToken", payload.refreshToken);
        set({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            user: payload.user
        });
    },
    clearAuth: () => {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        set({
            accessToken: null,
            refreshToken: null,
            user: null
        });
    }
}));
export const syncAuthFromStorage = () => {
    useAuthStore.setState({
        accessToken: getStoredAccessToken(),
        refreshToken: getStoredRefreshToken()
    });
};
