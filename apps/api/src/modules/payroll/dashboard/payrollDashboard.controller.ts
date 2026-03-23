import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { payrollDashboardService } from "./payrollDashboard.service.js";

export class PayrollDashboardController {
  summary = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollDashboardService.summary(request.query.branchId as string | undefined);
    sendSuccess(response, "Payroll dashboard summary fetched", data);
  };
}

export const payrollDashboardController = new PayrollDashboardController();
