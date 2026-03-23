import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { payrollReportService } from "./payrollReport.service.js";

const parseFilters = (request: Request) => ({
  ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
  ...(request.query.month ? { month: Number(request.query.month) } : {}),
  ...(request.query.year ? { year: Number(request.query.year) } : {})
});

export class PayrollReportController {
  salaryRegister = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollReportService.salaryRegister(parseFilters(request));
    sendSuccess(response, "Salary register fetched", data);
  };

  statutoryDeductions = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollReportService.statutoryDeductions(parseFilters(request));
    sendSuccess(response, "Statutory deductions fetched", data);
  };

  employeeExceptions = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollReportService.employeeExceptions(parseFilters(request));
    sendSuccess(response, "Employee exceptions fetched", data);
  };
}

export const payrollReportController = new PayrollReportController();
