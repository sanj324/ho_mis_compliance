import type { AuthUser, LoginResponse } from "@ho-mis/types";

export type LoginFormValues = {
  username: string;
  password: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuth: (payload: LoginResponse) => void;
  clearAuth: () => void;
};
