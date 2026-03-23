import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { stockTransferService } from "./stockTransfer.service.js";

export class StockTransferController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stock transfers fetched", await stockTransferService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stock transfer created", await stockTransferService.create(request.body, request.context), 201);
  };
}

export const stockTransferController = new StockTransferController();
