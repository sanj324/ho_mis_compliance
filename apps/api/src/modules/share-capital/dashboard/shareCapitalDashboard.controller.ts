import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { shareCapitalDashboardService } from "./shareCapitalDashboard.service.js";

export class ShareCapitalDashboardController {
  async summary(request: Request, response: Response) {
    const branchId = typeof request.query.branchId === "string" ? request.query.branchId : undefined;
    const isHoUser = request.authUser?.roleCodes.includes("HO_ADMIN") ?? false;
    const summary = await shareCapitalDashboardService.summary(isHoUser ? branchId : request.authUser?.branchId ?? undefined);
    sendSuccess(response, "Share capital dashboard summary fetched successfully", summary);
  }
}

export const shareCapitalDashboardController = new ShareCapitalDashboardController();
