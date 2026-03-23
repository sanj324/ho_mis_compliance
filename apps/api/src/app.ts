import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { authMiddleware } from "./common/middleware/auth.middleware.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import { notFoundMiddleware } from "./common/middleware/not-found.middleware.js";
import { requestContextMiddleware } from "./common/middleware/request-context.middleware.js";
import { registerComplianceScheduler } from "./core/scheduler/compliance.scheduler.js";
import { registerInsuranceScheduler } from "./core/scheduler/insurance.scheduler.js";
import { registerMaturityScheduler } from "./core/scheduler/maturity.scheduler.js";
import { registerPayrollScheduler } from "./core/scheduler/payroll.scheduler.js";
import { apiRouter } from "./routes/index.js";

export type CreateAppOptions = {
  enableSchedulers?: boolean;
};

export const createApp = ({ enableSchedulers = true }: CreateAppOptions = {}) => {
  const app = express();
  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin ${origin}`));
      }
    })
  );
  app.use(helmet());
  app.use(express.json());
  app.use(requestContextMiddleware);
  app.use(authMiddleware);
  app.use((request, _response, next) => {
    logger.info({ method: request.method, path: request.path, requestId: request.context.requestId });
    next();
  });

  app.get("/health", (_request, response) => {
    response.json({
      success: true,
      message: "API healthy",
      data: {
        status: "ok",
        apiPrefix: env.API_PREFIX,
        uptimeSeconds: Math.round(process.uptime())
      }
    });
  });

  app.use(env.API_PREFIX, apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  if (enableSchedulers) {
    registerComplianceScheduler();
    registerInsuranceScheduler();
    registerMaturityScheduler();
    registerPayrollScheduler();
  }

  return app;
};

export const app = createApp();
