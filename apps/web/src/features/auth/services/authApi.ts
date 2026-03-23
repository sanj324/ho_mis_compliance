import type { LoginRequest, LoginResponse } from "@ho-mis/types";

import { api } from "../../../lib/api";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<{ success: true; data: LoginResponse }>("/auth/login", payload);
    return response.data.data;
  },
  me: async (): Promise<LoginResponse["user"]> => {
    const response = await api.get<{ success: true; data: LoginResponse["user"] }>("/auth/me");
    return response.data.data;
  }
};
