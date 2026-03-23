import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { investmentDashboardService } from "./investmentDashboard.service.js";

export class InvestmentDashboardController {
  summary = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentDashboardService.summary(request.query.branchId as string | undefined);
    sendSuccess(response, "Investment dashboard summary fetched", data);
  };
}

export const investmentDashboardController = new InvestmentDashboardController();
