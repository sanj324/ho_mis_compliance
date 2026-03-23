import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { stockService } from "./stock.service.js";

export class StockController {
  register = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stock register fetched", await stockService.getStockRegister(request.query.branchId as string | undefined));
  };
}

export const stockController = new StockController();
