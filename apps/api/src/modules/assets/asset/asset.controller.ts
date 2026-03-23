import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetService } from "./asset.service.js";

export class AssetController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await assetService.list({
      ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
      ...(request.query.status ? { status: String(request.query.status) } : {}),
      ...(request.query.categoryId ? { categoryId: String(request.query.categoryId) } : {})
    });
    sendSuccess(response, "Assets fetched", data);
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset fetched", await assetService.getById(String(request.params.id)));
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset created", await assetService.create(request.body, request.context), 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset updated", await assetService.update(String(request.params.id), request.body, request.context));
  };
}

export const assetController = new AssetController();
