import type { Request, Response } from "express";

import { AppError } from "../../../common/errors/app-error.js";
import { sendReportExport, type ExportFormat } from "../../../common/utils/report-export.js";
import { assetReportService } from "./assetReport.service.js";

const parseFormat = (value: unknown): ExportFormat => {
  if (value === "csv" || value === "excel" || value === "pdf") {
    return value;
  }

  throw new AppError("Unsupported export format", 400);
};

export class AssetReportExportController {
  register = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await assetReportService.register(branchId);

    sendReportExport(response, {
      fileBaseName: "asset-register",
      worksheetName: "Asset Register",
      title: "Asset Register",
      format,
      rows
    });
  };

  depreciationSchedule = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await assetReportService.depreciationSchedule(branchId);

    sendReportExport(response, {
      fileBaseName: "asset-depreciation-schedule",
      worksheetName: "Depreciation Schedule",
      title: "Asset Depreciation Schedule",
      format,
      rows
    });
  };

  insuranceExpiry = async (request: Request, response: Response): Promise<void> => {
    const branchId = request.query.branchId as string | undefined;
    const format = parseFormat(request.query.format);
    const rows = await assetReportService.insuranceExpiry(branchId);

    sendReportExport(response, {
      fileBaseName: "asset-insurance-expiry",
      worksheetName: "Insurance Expiry",
      title: "Asset Insurance Expiry",
      format,
      rows
    });
  };
}

export const assetReportExportController = new AssetReportExportController();
