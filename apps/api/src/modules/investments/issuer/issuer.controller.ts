import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { issuerService } from "./issuer.service.js";

export class IssuerController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await issuerService.list();
    sendSuccess(response, "Issuers fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await issuerService.create(request.body, request.context);
    sendSuccess(response, "Issuer created", data, 201);
  };
}

export const issuerController = new IssuerController();
