import { Router } from "express";

import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { userController } from "./user.controller.js";
import { createUserSchema, updateUserSchema } from "./user.validator.js";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/options", requirePermissions(PERMISSIONS.USERS_READ), async (request, response, next) => {
  try {
    await userController.options(request, response);
  } catch (error) {
    next(error);
  }
});

userRoutes.get("/", requirePermissions(PERMISSIONS.USERS_READ), async (request, response, next) => {
  try {
    await userController.list(request, response);
  } catch (error) {
    next(error);
  }
});

userRoutes.get("/:id", requirePermissions(PERMISSIONS.USERS_READ), async (request, response, next) => {
  try {
    await userController.getById(request, response);
  } catch (error) {
    next(error);
  }
});

userRoutes.post("/", requirePermissions(PERMISSIONS.USERS_CREATE), async (request, response, next) => {
  try {
    request.body = createUserSchema.parse(request.body);
    await userController.create(request, response);
  } catch (error) {
    next(error);
  }
});

userRoutes.patch("/:id", requirePermissions(PERMISSIONS.USERS_UPDATE), async (request, response, next) => {
  try {
    request.body = updateUserSchema.parse(request.body);
    await userController.update(request, response);
  } catch (error) {
    next(error);
  }
});

userRoutes.delete("/:id", requirePermissions(PERMISSIONS.USERS_DELETE), async (request, response, next) => {
  try {
    await userController.delete(request, response);
  } catch (error) {
    next(error);
  }
});
