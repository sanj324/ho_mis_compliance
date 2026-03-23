import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { notificationController } from "./notification.controller.js";

export const notificationRoutes = Router();

notificationRoutes.use(authMiddleware);

notificationRoutes.get("/", requirePermissions("notifications.read"), async (request, response, next) => {
  try {
    await notificationController.list(request, response);
  } catch (error) {
    next(error);
  }
});

notificationRoutes.post("/:id/read", requirePermissions("notifications.read"), async (request, response, next) => {
  try {
    await notificationController.read(request, response);
  } catch (error) {
    next(error);
  }
});
