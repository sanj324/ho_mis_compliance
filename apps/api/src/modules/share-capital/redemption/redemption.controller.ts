import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { redemptionService } from "./redemption.service.js";

export class RedemptionController {
  async create(request: Request, response: Response) {
    const redemption = await redemptionService.create(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Share redemption created successfully", redemption, StatusCodes.CREATED);
  }
}

export const redemptionController = new RedemptionController();
