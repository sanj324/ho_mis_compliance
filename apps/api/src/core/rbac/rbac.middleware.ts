import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../common/errors/app-error.js";
import { rbacService } from "./rbac.service.js";

export const requirePermissions =
  (...requiredPermissions: string[]) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.authUser) {
      next(new AppError("Authentication required", 401));
      return;
    }

    const allowed = rbacService.hasPermissions({
      grantedPermissions: request.authUser.permissionCodes,
      requiredPermissions
    });

    if (!allowed) {
      next(new AppError("Insufficient permissions", 403));
      return;
    }

    next();
  };
