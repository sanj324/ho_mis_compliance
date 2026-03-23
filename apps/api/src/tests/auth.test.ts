import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import type { TestHttpClient } from "../common/utils/test-app.js";
import { createTestApp, loginAsAdmin } from "../common/utils/test-app.js";
import { disconnectTestDb, getTestDb, prepareTestDatabase } from "../common/utils/test-db.js";

describe("auth routes", () => {
  let client: TestHttpClient;

  before(async () => {
    await prepareTestDatabase();
    client = await createTestApp();
  });

  after(async () => {
    await disconnectTestDb();
  });

  it("returns a health payload for readiness checks", async () => {
    const response = await client.get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, "ok");
    assert.equal(response.body.data.apiPrefix, "/api");
  });

  it("logs in with the seeded admin user and records an audit entry", async () => {
    const response = await loginAsAdmin(client);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.user.username, "admin.ho");
    assert.ok(response.body.data.accessToken);
    assert.ok(response.body.data.refreshToken);

    const prisma = await getTestDb();
    const auditLog = await prisma.auditLog.findFirst({
      where: {
        moduleName: "AUTH",
        action: "LOGIN",
        entityName: "User"
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    assert.ok(auditLog);
    assert.equal(auditLog?.userId !== null, true);
  });

  it("refreshes the token set and returns the current user profile", async () => {
    const loginResponse = await loginAsAdmin(client);
    const refreshResponse = await client.post("/api/auth/refresh").send({
      refreshToken: loginResponse.body.data.refreshToken
    });

    assert.equal(refreshResponse.status, 200);
    assert.equal(refreshResponse.body.success, true);
    assert.ok(refreshResponse.body.data.accessToken);
    assert.ok(refreshResponse.body.data.refreshToken);

    const meResponse = await client
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${refreshResponse.body.data.accessToken}`);

    assert.equal(meResponse.status, 200);
    assert.equal(meResponse.body.success, true);
    assert.equal(meResponse.body.data.username, "admin.ho");
    assert.ok(Array.isArray(meResponse.body.data.permissionCodes));
    assert.ok(meResponse.body.data.permissionCodes.includes("dashboard.read"));
  });
});
