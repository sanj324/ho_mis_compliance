import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { itemCategoryService } from "./itemCategory.service.js";

export class ItemCategoryController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Item categories fetched", await itemCategoryService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Item category created", await itemCategoryService.create(request.body, request.context), 201);
  };
}

export const itemCategoryController = new ItemCategoryController();
