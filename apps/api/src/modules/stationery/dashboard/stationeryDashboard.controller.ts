import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { stationeryDashboardService } from "./stationeryDashboard.service.js";

export class StationeryDashboardController {
  summary = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stationery dashboard summary fetched", await stationeryDashboardService.summary(request.query.branchId as string | undefined));
  };
}

export const stationeryDashboardController = new StationeryDashboardController();
