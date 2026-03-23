import { create } from "zustand";

import type { LoginResponse } from "@ho-mis/types";
import type { AuthState } from "../types";

const getStoredAccessToken = (): string | null => window.localStorage.getItem("accessToken");
const getStoredRefreshToken = (): string | null => window.localStorage.getItem("refreshToken");

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  user: null,
  setAuth: (payload: LoginResponse) => {
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

export const syncAuthFromStorage = (): void => {
  useAuthStore.setState({
    accessToken: getStoredAccessToken(),
    refreshToken: getStoredRefreshToken()
  });
};
