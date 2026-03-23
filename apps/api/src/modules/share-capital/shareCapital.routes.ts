import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { allotmentController } from "./allotment/allotment.controller.js";
import { createAllotmentSchema } from "./allotment/allotment.validator.js";
import { shareCapitalDashboardController } from "./dashboard/shareCapitalDashboard.controller.js";
import { dividendController } from "./dividend/dividend.controller.js";
import { declareDividendSchema } from "./dividend/dividend.validator.js";
import { memberController } from "./member/member.controller.js";
import { createMemberSchema, updateMemberSchema } from "./member/member.validator.js";
import { redemptionController } from "./redemption/redemption.controller.js";
import { createRedemptionSchema } from "./redemption/redemption.validator.js";
import { shareCapitalReportController } from "./reports/shareCapitalReport.controller.js";
import { shareClassController } from "./share-class/shareClass.controller.js";
import { createShareClassSchema } from "./share-class/shareClass.validator.js";
import { shareTransferController } from "./transfer/shareTransfer.controller.js";
import { createShareTransferSchema } from "./transfer/shareTransfer.validator.js";

export const shareCapitalRoutes = Router();

shareCapitalRoutes.use(authMiddleware);

shareCapitalRoutes.get("/dashboard/summary", requirePermissions("shareCapital.read"), async (request, response, next) => {
  try {
    await shareCapitalDashboardController.summary(request, response);
  } catch (error) {
    next(error);
  }
});

shareCapitalRoutes.get("/reports/share-register", requirePermissions("shareCapital.reports"), async (request, response, next) => {
  try {
    await shareCapitalReportController.shareRegister(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.get("/reports/dividend-register", requirePermissions("shareCapital.reports"), async (request, response, next) => {
  try {
    await shareCapitalReportController.dividendRegister(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.get("/reports/kyc-deficient-members", requirePermissions("shareCapital.reports"), async (request, response, next) => {
  try {
    await shareCapitalReportController.kycDeficientMembers(request, response);
  } catch (error) {
    next(error);
  }
});

shareCapitalRoutes.get("/members", requirePermissions("shareCapital.read"), async (request, response, next) => {
  try {
    await memberController.list(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.get("/members/:id", requirePermissions("shareCapital.read"), async (request, response, next) => {
  try {
    await memberController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.post("/members", requirePermissions("shareCapital.create"), async (request, response, next) => {
  try {
    request.body = createMemberSchema.parse(request.body);
    await memberController.create(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.patch("/members/:id", requirePermissions("shareCapital.update"), async (request, response, next) => {
  try {
    request.body = updateMemberSchema.parse(request.body);
    await memberController.update(request, response);
  } catch (error) {
    next(error);
  }
});

shareCapitalRoutes.get("/share-classes", requirePermissions("shareCapital.read"), async (request, response, next) => {
  try {
    await shareClassController.list(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.post("/share-classes", requirePermissions("shareCapital.create"), async (request, response, next) => {
  try {
    request.body = createShareClassSchema.parse(request.body);
    await shareClassController.create(request, response);
  } catch (error) {
    next(error);
  }
});

shareCapitalRoutes.post("/allotments", requirePermissions("shareCapital.create"), async (request, response, next) => {
  try {
    request.body = createAllotmentSchema.parse(request.body);
    await allotmentController.create(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.post("/transfers", requirePermissions("shareCapital.update"), async (request, response, next) => {
  try {
    request.body = createShareTransferSchema.parse(request.body);
    await shareTransferController.create(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.post("/redemptions", requirePermissions("shareCapital.update"), async (request, response, next) => {
  try {
    request.body = createRedemptionSchema.parse(request.body);
    await redemptionController.create(request, response);
  } catch (error) {
    next(error);
  }
});

shareCapitalRoutes.get("/dividends", requirePermissions("shareCapital.read"), async (request, response, next) => {
  try {
    await dividendController.list(request, response);
  } catch (error) {
    next(error);
  }
});
shareCapitalRoutes.post("/dividends/declare", requirePermissions("shareCapital.dividend"), async (request, response, next) => {
  try {
    request.body = declareDividendSchema.parse(request.body);
    await dividendController.declare(request, response);
  } catch (error) {
    next(error);
  }
});
