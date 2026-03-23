import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../rbac/rbac.middleware.js";
import { documentController } from "./document.controller.js";
import { uploadDocumentSchema } from "./document.validator.js";

export const documentRoutes = Router();

documentRoutes.use(authMiddleware);

documentRoutes.post("/upload", requirePermissions("documents.upload"), async (request, response, next) => {
  try {
    request.body = uploadDocumentSchema.parse(request.body);
    await documentController.upload(request, response);
  } catch (error) {
    next(error);
  }
});

documentRoutes.get("/", requirePermissions("documents.read"), async (request, response, next) => {
  try {
    await documentController.list(request, response);
  } catch (error) {
    next(error);
  }
});

documentRoutes.get("/:id", requirePermissions("documents.read"), async (request, response, next) => {
  try {
    await documentController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
