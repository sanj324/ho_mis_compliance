import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { allotmentService } from "./allotment.service.js";

export class AllotmentController {
  async create(request: Request, response: Response) {
    const allotment = await allotmentService.create(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Share allotment created successfully", allotment, StatusCodes.CREATED);
  }
}

export const allotmentController = new AllotmentController();
