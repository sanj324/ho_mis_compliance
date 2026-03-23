import { Router } from "express";

import { authMiddleware } from "../../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../../core/rbac/rbac.middleware.js";
import { designationController } from "./designation.controller.js";
import { createDesignationSchema, updateDesignationSchema } from "./designation.validator.js";

export const designationRoutes = Router();

designationRoutes.use(authMiddleware);
designationRoutes.get("/", requirePermissions("designations.read"), async (request, response, next) => {
  try {
    await designationController.list(request, response);
  } catch (error) {
    next(error);
  }
});

designationRoutes.post("/", requirePermissions("designations.create"), async (request, response, next) => {
  try {
    request.body = createDesignationSchema.parse(request.body);
    await designationController.create(request, response);
  } catch (error) {
    next(error);
  }
});

designationRoutes.patch("/:id", requirePermissions("designations.update"), async (request, response, next) => {
  try {
    request.body = updateDesignationSchema.parse(request.body);
    await designationController.update(request, response);
  } catch (error) {
    next(error);
  }
});

designationRoutes.delete("/:id", requirePermissions("designations.delete"), async (request, response, next) => {
  try {
    await designationController.delete(request, response);
  } catch (error) {
    next(error);
  }
});
