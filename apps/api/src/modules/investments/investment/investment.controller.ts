import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { investmentService } from "./investment.service.js";

export class InvestmentController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentService.list({
      ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
      ...(request.query.classification ? { classification: String(request.query.classification) } : {}),
      ...(request.query.rating ? { rating: String(request.query.rating) } : {})
    });
    sendSuccess(response, "Investments fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentService.create(request.body, request.context);
    sendSuccess(response, "Investment created", data, 201);
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentService.getById(String(request.params.id));
    sendSuccess(response, "Investment fetched", data);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Investment updated", data);
  };
}

export const investmentController = new InvestmentController();
