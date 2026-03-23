import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { brokerService } from "./broker.service.js";

export class BrokerController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await brokerService.list();
    sendSuccess(response, "Brokers fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await brokerService.create(request.body, request.context);
    sendSuccess(response, "Broker created", data, 201);
  };
}

export const brokerController = new BrokerController();
