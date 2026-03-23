import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetTransferService } from "./assetTransfer.service.js";

export class AssetTransferController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset transfers fetched", await assetTransferService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset transfer created", await assetTransferService.create(request.body, request.context), 201);
  };
}

export const assetTransferController = new AssetTransferController();
