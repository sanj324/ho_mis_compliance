import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { complianceController } from "./compliance.controller.js";
import { closeComplianceEventSchema } from "./compliance.validator.js";

export const complianceRoutes = Router();

complianceRoutes.use(authMiddleware);

complianceRoutes.get("/events", requirePermissions("compliance.read"), async (request, response, next) => {
  try {
    await complianceController.listEvents(request, response);
  } catch (error) {
    next(error);
  }
});

complianceRoutes.get("/dashboard/summary", requirePermissions("compliance.read"), async (request, response, next) => {
  try {
    await complianceController.dashboardSummary(request, response);
  } catch (error) {
    next(error);
  }
});

complianceRoutes.get("/calendar", requirePermissions("compliance.read"), async (request, response, next) => {
  try {
    await complianceController.calendar(request, response);
  } catch (error) {
    next(error);
  }
});

complianceRoutes.post("/events/:id/close", requirePermissions("compliance.close"), async (request, response, next) => {
  try {
    request.body = closeComplianceEventSchema.parse(request.body);
    await complianceController.closeEvent(request, response);
  } catch (error) {
    next(error);
  }
});
