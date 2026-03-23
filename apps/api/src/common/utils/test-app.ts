import type { SuperTest, Test } from "supertest";
import request from "supertest";

import { ensureTestEnvironment } from "./test-db.js";

export type TestHttpClient = SuperTest<Test>;

type TestAuthOverrides = Partial<{
  userId: string;
  username: string;
  fullName: string;
  branchId: string | null;
  roleCodes: string[];
  permissionCodes: string[];
}>;

const defaultAuthPayload = {
  userId: "test-user-id",
  username: "test.user",
  fullName: "Test User",
  branchId: "test-branch-id",
  roleCodes: ["HO_ADMIN"],
  permissionCodes: [
    "dashboard.read",
    "users.read",
    "branches.read",
    "payroll.read",
    "payroll.reports",
    "investments.read",
    "investments.reports",
    "investments.exposure",
    "compliance.read",
    "compliance.close"
  ]
};

export const createTestApp = async (): Promise<TestHttpClient> => {
  ensureTestEnvironment();
  const { createApp } = await import("../../app.js");
  return request(createApp({ enableSchedulers: false }));
};

export const createAccessToken = async (overrides: TestAuthOverrides = {}): Promise<string> => {
  ensureTestEnvironment();
  const { signAccessToken } = await import("./jwt.js");

  return signAccessToken({
    ...defaultAuthPayload,
    ...overrides
  });
};

export const createAuthHeaders = async (overrides: TestAuthOverrides = {}): Promise<Record<string, string>> => {
  const accessToken = await createAccessToken(overrides);
  return {
    Authorization: `Bearer ${accessToken}`
  };
};

export const loginAsAdmin = async (client: TestHttpClient) =>
  client.post("/api/auth/login").send({
    username: "admin.ho",
    password: "Admin@123"
  });
