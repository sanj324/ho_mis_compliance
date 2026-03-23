import { Router } from "express";

import { authMiddleware } from "../../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../../core/rbac/rbac.middleware.js";
import { departmentController } from "./department.controller.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validator.js";

export const departmentRoutes = Router();

departmentRoutes.use(authMiddleware);
departmentRoutes.get("/", requirePermissions("departments.read"), async (request, response, next) => {
  try {
    await departmentController.list(request, response);
  } catch (error) {
    next(error);
  }
});

departmentRoutes.post("/", requirePermissions("departments.create"), async (request, response, next) => {
  try {
    request.body = createDepartmentSchema.parse(request.body);
    await departmentController.create(request, response);
  } catch (error) {
    next(error);
  }
});

departmentRoutes.patch("/:id", requirePermissions("departments.update"), async (request, response, next) => {
  try {
    request.body = updateDepartmentSchema.parse(request.body);
    await departmentController.update(request, response);
  } catch (error) {
    next(error);
  }
});

departmentRoutes.delete("/:id", requirePermissions("departments.delete"), async (request, response, next) => {
  try {
    await departmentController.delete(request, response);
  } catch (error) {
    next(error);
  }
});
