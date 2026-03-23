import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { shareClassService } from "./shareClass.service.js";

export class ShareClassController {
  async list(_request: Request, response: Response) {
    const shareClasses = await shareClassService.list();
    sendSuccess(response, "Share classes fetched successfully", shareClasses);
  }

  async create(request: Request, response: Response) {
    const shareClass = await shareClassService.create(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Share class created successfully", shareClass, StatusCodes.CREATED);
  }
}

export const shareClassController = new ShareClassController();
