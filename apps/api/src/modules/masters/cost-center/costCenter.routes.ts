import { Router } from "express";

import { authMiddleware } from "../../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../../core/rbac/rbac.middleware.js";
import { costCenterController } from "./costCenter.controller.js";
import { createCostCenterSchema, updateCostCenterSchema } from "./costCenter.validator.js";

export const costCenterRoutes = Router();

costCenterRoutes.use(authMiddleware);
costCenterRoutes.get("/", requirePermissions("costCenters.read"), async (request, response, next) => {
  try {
    await costCenterController.list(request, response);
  } catch (error) {
    next(error);
  }
});

costCenterRoutes.post("/", requirePermissions("costCenters.create"), async (request, response, next) => {
  try {
    request.body = createCostCenterSchema.parse(request.body);
    await costCenterController.create(request, response);
  } catch (error) {
    next(error);
  }
});

costCenterRoutes.patch("/:id", requirePermissions("costCenters.update"), async (request, response, next) => {
  try {
    request.body = updateCostCenterSchema.parse(request.body);
    await costCenterController.update(request, response);
  } catch (error) {
    next(error);
  }
});

costCenterRoutes.delete("/:id", requirePermissions("costCenters.delete"), async (request, response, next) => {
  try {
    await costCenterController.delete(request, response);
  } catch (error) {
    next(error);
  }
});
