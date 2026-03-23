import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { costCenterService } from "./costCenter.service.js";

export class CostCenterController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await costCenterService.list(request.query.branchId as string | undefined);
    sendSuccess(response, "Cost centers fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await costCenterService.create(request.body, request.context);
    sendSuccess(response, "Cost center created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await costCenterService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Cost center updated", data);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await costCenterService.delete(String(request.params.id), request.context);
    sendSuccess(response, "Cost center deleted", null);
  };
}

export const costCenterController = new CostCenterController();
