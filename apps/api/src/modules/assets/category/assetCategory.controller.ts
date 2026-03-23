import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetCategoryService } from "./assetCategory.service.js";

export class AssetCategoryController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset categories fetched", await assetCategoryService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset category created", await assetCategoryService.create(request.body, request.context), 201);
  };
}

export const assetCategoryController = new AssetCategoryController();
