import type { Request, Response } from "express";

import { AppError } from "../../../common/errors/app-error.js";
import { sendReportExport, type ExportFormat } from "../../../common/utils/report-export.js";
import { stationeryReportService } from "./stationeryReport.service.js";

const parseFormat = (value: unknown): ExportFormat => {
  if (value === "csv" || value === "excel" || value === "pdf") {
    return value;
  }

  throw new AppError("Unsupported export format", 400);
};

export class StationeryReportExportController {
  stockRegister = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await stationeryReportService.stockRegister(branchId);

    sendReportExport(response, {
      fileBaseName: "stationery-stock-register",
      worksheetName: "Stock Register",
      title: "Stationery Stock Register",
      format,
      rows
    });
  };

  consumption = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await stationeryReportService.consumption(branchId);

    sendReportExport(response, {
      fileBaseName: "stationery-consumption-report",
      worksheetName: "Consumption",
      title: "Stationery Consumption Report",
      format,
      rows
    });
  };

  lowStock = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await stationeryReportService.lowStock(branchId);

    sendReportExport(response, {
      fileBaseName: "stationery-low-stock-report",
      worksheetName: "Low Stock",
      title: "Stationery Low Stock Report",
      format,
      rows
    });
  };
}

export const stationeryReportExportController = new StationeryReportExportController();
