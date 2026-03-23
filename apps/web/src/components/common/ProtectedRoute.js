import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
export const ProtectedRoute = ({ children }) => {
    const accessToken = useAuthStore((state) => state.accessToken);
    if (!accessToken) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
