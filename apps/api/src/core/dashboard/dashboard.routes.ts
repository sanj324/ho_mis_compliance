import { Router } from "express";

import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { dashboardController } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.get("/ho-summary", requirePermissions(PERMISSIONS.DASHBOARD_READ), async (request, response, next) => {
  try {
    await dashboardController.hoSummary(request, response);
  } catch (error) {
    next(error);
  }
});
