import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { dashboardService } from "./dashboard.service.js";

export class DashboardController {
  hoSummary = async (_request: Request, response: Response): Promise<void> => {
    const data = await dashboardService.getHOSummary();
    sendSuccess(response, "HO summary fetched", data);
  };
}

export const dashboardController = new DashboardController();
