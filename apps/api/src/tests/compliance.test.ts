import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import type { TestHttpClient } from "../common/utils/test-app.js";
import { createTestApp, loginAsAdmin } from "../common/utils/test-app.js";
import { disconnectTestDb, getTestDb, prepareTestDatabase } from "../common/utils/test-db.js";

describe("compliance routes", () => {
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

  it("returns the seeded compliance dashboard and calendar data", async () => {
    const summaryResponse = await client
      .get("/api/compliance/dashboard/summary")
      .set("Authorization", `Bearer ${accessToken}`);

    const calendarResponse = await client
      .get("/api/compliance/calendar")
      .set("Authorization", `Bearer ${accessToken}`);

    assert.equal(summaryResponse.status, 200);
    assert.equal(summaryResponse.body.success, true);
    assert.equal(summaryResponse.body.data.openEvents, 2);
    assert.equal(summaryResponse.body.data.highSeverityOpen, 1);
    assert.ok(Array.isArray(summaryResponse.body.data.byModule));

    assert.equal(calendarResponse.status, 200);
    assert.equal(calendarResponse.body.success, true);
    assert.equal(Array.isArray(calendarResponse.body.data), true);
    assert.ok(calendarResponse.body.data.length >= 2);
  });

  it("closes a seeded compliance event", async () => {
    const prisma = await getTestDb();
    const event = await prisma.complianceEvent.findFirst({
      where: {
        status: "OPEN",
        ruleCode: "PAYROLL_KYC_DEFICIENT"
      }
    });

    assert.ok(event);

    const response = await client
      .post(`/api/compliance/events/${event?.id}/close`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        remarks: "Closed during starter integration test."
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, "CLOSED");
    assert.equal(response.body.data.remarks, "Closed during starter integration test.");
  });
});
