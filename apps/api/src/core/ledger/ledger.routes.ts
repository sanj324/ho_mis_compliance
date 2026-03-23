import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { ledgerController } from "./ledger.controller.js";

export const ledgerRoutes = Router();

ledgerRoutes.use(authMiddleware);

ledgerRoutes.get("/accounts", requirePermissions("ledger.read"), async (request, response, next) => {
  try {
    await ledgerController.listAccounts(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.get("/vouchers", requirePermissions("ledger.read"), async (request, response, next) => {
  try {
    await ledgerController.listVouchers(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.post("/postings/payroll/:runId", requirePermissions("ledger.post"), async (request, response, next) => {
  try {
    await ledgerController.postPayroll(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.post("/postings/investment/:id", requirePermissions("ledger.post"), async (request, response, next) => {
  try {
    await ledgerController.postInvestment(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.post("/postings/asset/:id", requirePermissions("ledger.post"), async (request, response, next) => {
  try {
    await ledgerController.postAsset(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.post("/postings/stationery/:id", requirePermissions("ledger.post"), async (request, response, next) => {
  try {
    await ledgerController.postStationery(request, response);
  } catch (error) {
    next(error);
  }
});

ledgerRoutes.post("/postings/share-capital/:id", requirePermissions("ledger.post"), async (request, response, next) => {
  try {
    await ledgerController.postShareCapital(request, response);
  } catch (error) {
    next(error);
  }
});
