import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { payrollRunService } from "./payrollRun.service.js";

export class PayrollRunController {
  list = async (request: Request, response: Response): Promise<void> => {
    const filters = {
      ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
      ...(request.query.month ? { month: Number(request.query.month) } : {}),
      ...(request.query.year ? { year: Number(request.query.year) } : {})
    };
    const data = await payrollRunService.list(filters);
    sendSuccess(response, "Payroll runs fetched", data);
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollRunService.getById(String(request.params.id));
    sendSuccess(response, "Payroll run fetched", data);
  };

  calculate = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollRunService.calculate(request.body, request.context);
    sendSuccess(response, "Payroll calculated", data, 201);
  };

  finalize = async (request: Request, response: Response): Promise<void> => {
    const data = await payrollRunService.finalize(request.body, request.context);
    sendSuccess(response, "Payroll finalized", data);
  };
}

export const payrollRunController = new PayrollRunController();
