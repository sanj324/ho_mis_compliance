import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { depreciationMethodService } from "./depreciationMethod.service.js";

export class DepreciationMethodController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Depreciation methods fetched", await depreciationMethodService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Depreciation method created", await depreciationMethodService.create(request.body, request.context), 201);
  };
}

export const depreciationMethodController = new DepreciationMethodController();
