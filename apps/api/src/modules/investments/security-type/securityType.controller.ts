import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { securityTypeService } from "./securityType.service.js";

export class SecurityTypeController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await securityTypeService.list();
    sendSuccess(response, "Security types fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await securityTypeService.create(request.body, request.context);
    sendSuccess(response, "Security type created", data, 201);
  };
}

export const securityTypeController = new SecurityTypeController();
