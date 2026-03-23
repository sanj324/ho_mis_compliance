import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { shareCapitalReportService } from "./shareCapitalReport.service.js";

export class ShareCapitalReportController {
  async shareRegister(request: Request, response: Response) {
    const branchId = typeof request.query.branchId === "string" ? request.query.branchId : undefined;
    const report = await shareCapitalReportService.shareRegister(branchId);
    sendSuccess(response, "Share register generated successfully", report);
  }

  async dividendRegister(_request: Request, response: Response) {
    const report = await shareCapitalReportService.dividendRegister();
    sendSuccess(response, "Dividend register generated successfully", report);
  }

  async kycDeficientMembers(request: Request, response: Response) {
    const branchId = typeof request.query.branchId === "string" ? request.query.branchId : undefined;
    const report = await shareCapitalReportService.kycDeficientMembers(branchId);
    sendSuccess(response, "KYC deficient members report generated successfully", report);
  }
}

export const shareCapitalReportController = new ShareCapitalReportController();
