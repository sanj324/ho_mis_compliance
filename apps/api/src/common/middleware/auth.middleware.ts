import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (request: Request, _response: Response, next: NextFunction): void => {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    request.authUser = payload;
    request.context = {
      requestId: request.context.requestId,
      userId: payload.userId,
      roleCodes: payload.roleCodes,
      branchId: payload.branchId
    };
  } catch {
  }

  next();
};
