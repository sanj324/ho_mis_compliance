import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
