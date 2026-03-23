import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetReportService } from "./assetReport.service.js";

export class AssetReportController {
  register = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset register fetched", await assetReportService.register(request.query.branchId as string | undefined));
  };

  depreciationSchedule = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(
      response,
      "Asset depreciation schedule fetched",
      await assetReportService.depreciationSchedule(request.query.branchId as string | undefined)
    );
  };

  insuranceExpiry = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset insurance expiry report fetched", await assetReportService.insuranceExpiry(request.query.branchId as string | undefined));
  };
}

export const assetReportController = new AssetReportController();
