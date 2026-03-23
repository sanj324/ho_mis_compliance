import { Router } from "express";

import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { auditController } from "./audit.controller.js";

export const auditRoutes = Router();

auditRoutes.use(authMiddleware);
auditRoutes.get("/", requirePermissions(PERMISSIONS.AUDIT_LOGS_READ), async (request, response, next) => {
  try {
    await auditController.list(request, response);
  } catch (error) {
    next(error);
  }
});
