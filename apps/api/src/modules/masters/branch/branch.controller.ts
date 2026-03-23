import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { branchService } from "./branch.service.js";

export class BranchController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await branchService.list();
    sendSuccess(response, "Branches fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await branchService.create(request.body, request.context);
    sendSuccess(response, "Branch created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await branchService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Branch updated", data);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await branchService.delete(String(request.params.id), request.context);
    sendSuccess(response, "Branch deleted", null);
  };
}

export const branchController = new BranchController();
