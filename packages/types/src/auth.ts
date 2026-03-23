export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  branchId: string | null;
  roleCodes: string[];
  permissionCodes: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = AuthTokens & {
  user: AuthUser;
};
