import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { insuranceService } from "./insurance.service.js";

export class InsuranceController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset insurance records fetched", await insuranceService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset insurance created", await insuranceService.create(request.body, request.context), 201);
  };
}

export const insuranceController = new InsuranceController();
