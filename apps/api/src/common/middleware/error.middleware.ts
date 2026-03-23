import type { NextFunction, Request, Response } from "express";

import { logger } from "../../config/logger.js";
import { sendErrorResponse } from "../errors/error-handler.js";

export const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
  logger.error({ err: error, requestId: request.context.requestId }, "request failed");
  sendErrorResponse(response, error);
};
