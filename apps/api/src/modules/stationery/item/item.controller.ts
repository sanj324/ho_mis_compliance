import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { itemService } from "./item.service.js";

export class ItemController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stationery items fetched", await itemService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stationery item created", await itemService.create(request.body, request.context), 201);
  };
}

export const itemController = new ItemController();
