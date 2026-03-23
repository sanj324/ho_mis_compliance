import { Router } from "express";

import { PERMISSIONS } from "../../../common/constants/permissions.js";
import { authMiddleware } from "../../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../../core/rbac/rbac.middleware.js";
import { branchController } from "./branch.controller.js";
import { createBranchSchema, updateBranchSchema } from "./branch.validator.js";

export const branchRoutes = Router();

branchRoutes.use(authMiddleware);

branchRoutes.get("/", requirePermissions(PERMISSIONS.BRANCHES_READ), async (request, response, next) => {
  try {
    await branchController.list(request, response);
  } catch (error) {
    next(error);
  }
});

branchRoutes.post("/", requirePermissions(PERMISSIONS.BRANCHES_CREATE), async (request, response, next) => {
  try {
    request.body = createBranchSchema.parse(request.body);
    await branchController.create(request, response);
  } catch (error) {
    next(error);
  }
});

branchRoutes.patch("/:id", requirePermissions(PERMISSIONS.BRANCHES_UPDATE), async (request, response, next) => {
  try {
    request.body = updateBranchSchema.parse(request.body);
    await branchController.update(request, response);
  } catch (error) {
    next(error);
  }
});

branchRoutes.delete("/:id", requirePermissions(PERMISSIONS.BRANCHES_DELETE), async (request, response, next) => {
  try {
    await branchController.delete(request, response);
  } catch (error) {
    next(error);
  }
});
