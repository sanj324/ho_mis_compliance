import type { LoginRequest, LoginResponse } from "@ho-mis/types";

export type AuthTokenPayload = {
  userId: string;
  username: string;
  fullName: string;
  branchId: string | null;
  roleCodes: string[];
  permissionCodes: string[];
};

export type LoginInput = LoginRequest;
export type LoginResult = LoginResponse;
