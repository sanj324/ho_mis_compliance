import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { shareTransferService } from "./shareTransfer.service.js";

export class ShareTransferController {
  async create(request: Request, response: Response) {
    const transfer = await shareTransferService.create(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Share transfer created successfully", transfer, StatusCodes.CREATED);
  }
}

export const shareTransferController = new ShareTransferController();
