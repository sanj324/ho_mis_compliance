import type { Request, Response } from "express";

import { AppError } from "../../common/errors/app-error.js";
import { sendSuccess } from "../../common/utils/response.js";
import { authService } from "./auth.service.js";

export class AuthController {
  login = async (request: Request, response: Response): Promise<void> => {
    const data = await authService.login(request.body, request.context.requestId);
    sendSuccess(response, "Login successful", data);
  };

  refresh = async (request: Request, response: Response): Promise<void> => {
    const data = await authService.refresh(request.body.refreshToken, request.context.requestId);
    sendSuccess(response, "Token refreshed", data);
  };

  me = async (request: Request, response: Response): Promise<void> => {
    if (!request.authUser) {
      throw new AppError("Authentication required", 401);
    }

    sendSuccess(response, "Current user fetched", authService.me(request.authUser));
  };
}

export const authController = new AuthController();
