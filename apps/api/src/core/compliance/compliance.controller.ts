import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { complianceService } from "./compliance.service.js";

export class ComplianceController {
  async listEvents(request: Request, response: Response) {
    const filters = {
      ...(typeof request.query.status === "string" ? { status: request.query.status } : {}),
      ...(typeof request.query.moduleName === "string" ? { moduleName: request.query.moduleName } : {}),
      ...(typeof request.query.branchId === "string" ? { branchId: request.query.branchId } : {})
    };
    const events = await complianceService.listEvents(filters);
    sendSuccess(response, "Compliance events fetched successfully", events);
  }

  async dashboardSummary(_request: Request, response: Response) {
    const summary = await complianceService.dashboardSummary();
    sendSuccess(response, "Compliance dashboard summary fetched successfully", summary);
  }

  async calendar(request: Request, response: Response) {
    const calendar = await complianceService.getCalendar(
      typeof request.query.branchId === "string" ? request.query.branchId : undefined
    );
    sendSuccess(response, "Compliance calendar fetched successfully", calendar);
  }

  async closeEvent(request: Request, response: Response) {
    const event = await complianceService.closeEvent(
      typeof request.params.id === "string" ? request.params.id : "",
      request.body,
      request.context.userId
    );
    sendSuccess(response, "Compliance event closed successfully", event);
  }
}

export const complianceController = new ComplianceController();
