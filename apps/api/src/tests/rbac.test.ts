import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import type { TestHttpClient } from "../common/utils/test-app.js";
import { createAuthHeaders, createTestApp } from "../common/utils/test-app.js";
import { disconnectTestDb, prepareTestDatabase } from "../common/utils/test-db.js";

describe("rbac middleware", () => {
  let client: TestHttpClient;

  before(async () => {
    await prepareTestDatabase();
    client = await createTestApp();
  });

  after(async () => {
    await disconnectTestDb();
  });

  it("rejects requests to protected routes without authentication", async () => {
    const response = await client.get("/api/dashboard/ho-summary");

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, "Authentication required");
  });

  it("allows requests when the token includes the required permission", async () => {
    const headers = await createAuthHeaders({
      permissionCodes: ["dashboard.read"],
      roleCodes: ["BRANCH_MANAGER"]
    });

    const response = await client.get("/api/dashboard/ho-summary").set(headers);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(typeof response.body.data.totalBranches, "number");
  });

  it("returns forbidden when the token does not include the required permission", async () => {
    const headers = await createAuthHeaders({
      permissionCodes: ["dashboard.read"],
      roleCodes: ["BRANCH_MANAGER"]
    });

    const response = await client.get("/api/compliance/events").set(headers);

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, "Insufficient permissions");
  });
});
