import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { salaryStructureService } from "./salaryStructure.service.js";

export class SalaryStructureController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await salaryStructureService.list(request.query.branchId as string | undefined);
    sendSuccess(response, "Salary structures fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await salaryStructureService.create(request.body, request.context);
    sendSuccess(response, "Salary structure created", data, 201);
  };
}

export const salaryStructureController = new SalaryStructureController();
