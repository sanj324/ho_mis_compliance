import type { Response } from "express";
import { ZodError } from "zod";

import { AppError } from "./app-error.js";

export const sendErrorResponse = (response: Response, error: Error): void => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.flatten()
    });
    return;
  }

  response.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
