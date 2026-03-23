import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { depreciationService } from "./depreciation.service.js";

export class DepreciationController {
  run = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Depreciation run completed", await depreciationService.run(request.body, request.context), 201);
  };
}

export const depreciationController = new DepreciationController();
