import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { counterpartyService } from "./counterparty.service.js";

export class CounterpartyController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await counterpartyService.list();
    sendSuccess(response, "Counterparties fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await counterpartyService.create(request.body, request.context);
    sendSuccess(response, "Counterparty created", data, 201);
  };
}

export const counterpartyController = new CounterpartyController();
