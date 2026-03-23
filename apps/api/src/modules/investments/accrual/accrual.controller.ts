import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { accrualService } from "./accrual.service.js";

export class AccrualController {
  create = async (request: Request, response: Response): Promise<void> => {
    const data = await accrualService.createAccrual(String(request.params.id), request.context);
    sendSuccess(response, "Investment accrual created", data, 201);
  };
}

export const accrualController = new AccrualController();
