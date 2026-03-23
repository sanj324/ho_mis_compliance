import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import type { TestHttpClient } from "../common/utils/test-app.js";
import { createTestApp, loginAsAdmin } from "../common/utils/test-app.js";
import { disconnectTestDb, prepareTestDatabase } from "../common/utils/test-db.js";

describe("payroll routes", () => {
  let client: TestHttpClient;
  let accessToken = "";

  before(async () => {
    await prepareTestDatabase();
    client = await createTestApp();
    const loginResponse = await loginAsAdmin(client);
    accessToken = loginResponse.body.data.accessToken;
  });

  after(async () => {
    await disconnectTestDb();
  });

  it("returns a seeded payroll dashboard summary", async () => {
    const response = await client
      .get("/api/payroll/dashboard/summary")
      .set("Authorization", `Bearer ${accessToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.employeeCount, 2);
    assert.equal(response.body.data.activeEmployeeCount, 2);
    assert.equal(response.body.data.pendingPayrollCount, 1);
    assert.equal(response.body.data.latestRunCode, "PR-2026-03-HO");
    assert.equal(response.body.data.exceptionCount, 1);
  });

  it("lists the seeded payroll employees", async () => {
    const response = await client.get("/api/payroll/employees").set("Authorization", `Bearer ${accessToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(Array.isArray(response.body.data), true);
    assert.equal(response.body.data.length, 2);
    assert.ok(response.body.data.some((employee: { employeeCode: string }) => employee.employeeCode === "EMP001"));
    assert.ok(response.body.data.some((employee: { employeeCode: string }) => employee.employeeCode === "EMP002"));
  });
});
