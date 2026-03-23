import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { requisitionService } from "./requisition.service.js";

export class RequisitionController {
  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Requisition created", await requisitionService.create(request.body, request.context), 201);
  };
}

export const requisitionController = new RequisitionController();
