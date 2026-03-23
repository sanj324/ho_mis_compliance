import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { dividendService } from "./dividend.service.js";

export class DividendController {
  async list(_request: Request, response: Response) {
    const declarations = await dividendService.list();
    sendSuccess(response, "Dividend declarations fetched successfully", declarations);
  }

  async declare(request: Request, response: Response) {
    const declaration = await dividendService.declare(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Dividend declared successfully", declaration, StatusCodes.CREATED);
  }
}

export const dividendController = new DividendController();
