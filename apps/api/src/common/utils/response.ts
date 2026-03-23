import type { Response } from "express";

export const sendSuccess = <T>(
  response: Response,
  message: string,
  data: T,
  statusCode = 200
): void => {
  response.status(statusCode).json({
    success: true,
    message,
    data
  });
};
