import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { accrualController } from "./accrual/accrual.controller.js";
import { brokerController } from "./broker/broker.controller.js";
import { createBrokerSchema } from "./broker/broker.validator.js";
import { counterpartyController } from "./counterparty/counterparty.controller.js";
import { createCounterpartySchema } from "./counterparty/counterparty.validator.js";
import { investmentDashboardController } from "./dashboard/investmentDashboard.controller.js";
import { exposureController } from "./exposure/exposure.controller.js";
import { investmentController } from "./investment/investment.controller.js";
import { createInvestmentSchema, updateInvestmentSchema } from "./investment/investment.validator.js";
import { issuerController } from "./issuer/issuer.controller.js";
import { createIssuerSchema } from "./issuer/issuer.validator.js";
import { investmentReportController } from "./reports/investmentReport.controller.js";
import { securityTypeController } from "./security-type/securityType.controller.js";
import { createSecurityTypeSchema } from "./security-type/securityType.validator.js";

export const investmentRoutes = Router();

investmentRoutes.use(authMiddleware);

investmentRoutes.get("/dashboard/summary", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await investmentDashboardController.summary(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/reports/register", requirePermissions("investments.reports"), async (request, response, next) => {
  try {
    await investmentReportController.register(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.get("/reports/maturity-ladder", requirePermissions("investments.reports"), async (request, response, next) => {
  try {
    await investmentReportController.maturityLadder(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.get("/reports/exposure-summary", requirePermissions("investments.reports"), async (request, response, next) => {
  try {
    await investmentReportController.exposureSummary(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.get("/exposure/checks", requirePermissions("investments.exposure"), async (request, response, next) => {
  try {
    await exposureController.checks(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/counterparties", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await counterpartyController.list(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/counterparties", requirePermissions("investments.create"), async (request, response, next) => {
  try {
    request.body = createCounterpartySchema.parse(request.body);
    await counterpartyController.create(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/security-types", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await securityTypeController.list(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/security-types", requirePermissions("investments.create"), async (request, response, next) => {
  try {
    request.body = createSecurityTypeSchema.parse(request.body);
    await securityTypeController.create(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/issuers", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await issuerController.list(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/issuers", requirePermissions("investments.create"), async (request, response, next) => {
  try {
    request.body = createIssuerSchema.parse(request.body);
    await issuerController.create(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/brokers", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await brokerController.list(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/brokers", requirePermissions("investments.create"), async (request, response, next) => {
  try {
    request.body = createBrokerSchema.parse(request.body);
    await brokerController.create(request, response);
  } catch (error) {
    next(error);
  }
});

investmentRoutes.get("/", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await investmentController.list(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/", requirePermissions("investments.create"), async (request, response, next) => {
  try {
    request.body = createInvestmentSchema.parse(request.body);
    await investmentController.create(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.get("/:id", requirePermissions("investments.read"), async (request, response, next) => {
  try {
    await investmentController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.patch("/:id", requirePermissions("investments.update"), async (request, response, next) => {
  try {
    request.body = updateInvestmentSchema.parse(request.body);
    await investmentController.update(request, response);
  } catch (error) {
    next(error);
  }
});
investmentRoutes.post("/:id/accrual", requirePermissions("investments.update"), async (request, response, next) => {
  try {
    await accrualController.create(request, response);
  } catch (error) {
    next(error);
  }
});
