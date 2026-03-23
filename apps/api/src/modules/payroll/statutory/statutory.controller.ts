import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { statutoryService } from "./statutory.service.js";

export class StatutoryController {
  getCurrent = async (request: Request, response: Response): Promise<void> => {
    const data = await statutoryService.getCurrent(request.query.branchId as string | undefined);
    sendSuccess(response, "Current statutory setup fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await statutoryService.create(request.body, request.context);
    sendSuccess(response, "Statutory setup created", data, 201);
  };
}

export const statutoryController = new StatutoryController();
