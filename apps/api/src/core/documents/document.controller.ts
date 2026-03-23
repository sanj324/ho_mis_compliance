import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../common/utils/response.js";
import { documentService } from "./document.service.js";

export class DocumentController {
  async upload(request: Request, response: Response) {
    const document = await documentService.upload(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Document uploaded successfully", document, StatusCodes.CREATED);
  }

  async list(request: Request, response: Response) {
    const filters = {
      ...(typeof request.query.moduleName === "string" ? { moduleName: request.query.moduleName } : {}),
      ...(typeof request.query.entityType === "string" ? { entityType: request.query.entityType } : {}),
      ...(typeof request.query.entityId === "string" ? { entityId: request.query.entityId } : {})
    };
    const documents = await documentService.list(filters);
    sendSuccess(response, "Documents fetched successfully", documents);
  }

  async getById(request: Request, response: Response) {
    const document = await documentService.getById(typeof request.params.id === "string" ? request.params.id : "");
    sendSuccess(response, "Document fetched successfully", document);
  }
}

export const documentController = new DocumentController();
