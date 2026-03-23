import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { authController } from "./auth.controller.js";
import { loginSchema, refreshSchema } from "./auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/login", async (request, response, next) => {
  try {
    request.body = loginSchema.parse(request.body);
    await authController.login(request, response);
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/refresh", async (request, response, next) => {
  try {
    request.body = refreshSchema.parse(request.body);
    await authController.refresh(request, response);
  } catch (error) {
    next(error);
  }
});

authRoutes.get("/me", authMiddleware, async (request, response, next) => {
  try {
    await authController.me(request, response);
  } catch (error) {
    next(error);
  }
});
