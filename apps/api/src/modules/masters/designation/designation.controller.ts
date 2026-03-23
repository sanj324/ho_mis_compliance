import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { designationService } from "./designation.service.js";

export class DesignationController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await designationService.list(request.query.branchId as string | undefined);
    sendSuccess(response, "Designations fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await designationService.create(request.body, request.context);
    sendSuccess(response, "Designation created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await designationService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Designation updated", data);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await designationService.delete(String(request.params.id), request.context);
    sendSuccess(response, "Designation deleted", null);
  };
}

export const designationController = new DesignationController();
