import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { stationeryReportService } from "./stationeryReport.service.js";

export class StationeryReportController {
  stockRegister = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stock register fetched", await stationeryReportService.stockRegister(request.query.branchId as string | undefined));
  };

  consumption = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Consumption report fetched", await stationeryReportService.consumption(request.query.branchId as string | undefined));
  };

  lowStock = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Low stock report fetched", await stationeryReportService.lowStock(request.query.branchId as string | undefined));
  };
}

export const stationeryReportController = new StationeryReportController();
