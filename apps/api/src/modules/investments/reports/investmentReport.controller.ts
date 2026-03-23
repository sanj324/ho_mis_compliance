import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { investmentReportService } from "./investmentReport.service.js";

export class InvestmentReportController {
  register = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentReportService.register(request.query.branchId as string | undefined);
    sendSuccess(response, "Investment register fetched", data);
  };

  maturityLadder = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentReportService.maturityLadder(request.query.branchId as string | undefined);
    sendSuccess(response, "Maturity ladder fetched", data);
  };

  exposureSummary = async (request: Request, response: Response): Promise<void> => {
    const data = await investmentReportService.exposureSummary(request.query.branchId as string | undefined);
    sendSuccess(response, "Exposure summary fetched", data);
  };
}

export const investmentReportController = new InvestmentReportController();
