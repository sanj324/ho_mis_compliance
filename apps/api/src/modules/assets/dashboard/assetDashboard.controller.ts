import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetDashboardService } from "./assetDashboard.service.js";

export class AssetDashboardController {
  summary = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset dashboard summary fetched", await assetDashboardService.summary(request.query.branchId as string | undefined));
  };
}

export const assetDashboardController = new AssetDashboardController();
