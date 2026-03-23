import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { APP_CONSTANTS } from "../constants/app.constants.js";

declare global {
  namespace Express {
    interface Request {
      context: {
        requestId: string;
        userId: string | null;
        roleCodes: string[];
        branchId: string | null;
      };
      authUser?: {
        userId: string;
        username: string;
        fullName: string;
        branchId: string | null;
        roleCodes: string[];
        permissionCodes: string[];
      };
    }
  }
}

export const requestContextMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const requestId = request.header(APP_CONSTANTS.REQUEST_ID_HEADER) ?? randomUUID();
  response.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, requestId);
  request.context = {
    requestId,
    userId: null,
    roleCodes: [],
    branchId: null
  };
  next();
};
