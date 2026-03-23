import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import type { TestHttpClient } from "../common/utils/test-app.js";
import { createTestApp, loginAsAdmin } from "../common/utils/test-app.js";
import { disconnectTestDb, prepareTestDatabase } from "../common/utils/test-db.js";

describe("investment routes", () => {
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

  it("returns the seeded investment dashboard aggregates", async () => {
    const response = await client
      .get("/api/investments/dashboard/summary")
      .set("Authorization", `Bearer ${accessToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.totalCount, 2);
    assert.equal(response.body.data.totalBookValue, 12425000);
    assert.equal(response.body.data.totalMarketValue, 12592000);
    assert.ok(response.body.data.byClassification.some((item: { classification: string }) => item.classification === "HTM"));
    assert.ok(response.body.data.byRating.some((item: { rating: string }) => item.rating === "SOV"));
  });

  it("lists the seeded investment register", async () => {
    const response = await client.get("/api/investments").set("Authorization", `Bearer ${accessToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(Array.isArray(response.body.data), true);
    assert.equal(response.body.data.length, 2);
    assert.ok(response.body.data.some((investment: { investmentCode: string }) => investment.investmentCode === "INV001"));
    assert.ok(response.body.data.some((investment: { investmentCode: string }) => investment.investmentCode === "INV002"));
  });
});
