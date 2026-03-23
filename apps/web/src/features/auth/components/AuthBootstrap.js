import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";
import { syncAuthFromStorage, useAuthStore } from "../store/authStore";
export const AuthBootstrap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    useEffect(() => {
        syncAuthFromStorage();
    }, []);
    useEffect(() => {
        const storedToken = window.localStorage.getItem("accessToken");
        if (!storedToken || user) {
            return;
        }
        let cancelled = false;
        void authApi
            .me()
            .then((currentUser) => {
            if (cancelled) {
                return;
            }
            useAuthStore.setState({
                accessToken: window.localStorage.getItem("accessToken"),
                refreshToken: window.localStorage.getItem("refreshToken"),
                user: currentUser
            });
        })
            .catch(() => {
            if (cancelled) {
                return;
            }
            clearAuth();
            if (location.pathname !== "/login") {
                navigate("/login", { replace: true });
            }
        });
        return () => {
            cancelled = true;
        };
    }, [accessToken, clearAuth, location.pathname, navigate, user]);
    return null;
};
