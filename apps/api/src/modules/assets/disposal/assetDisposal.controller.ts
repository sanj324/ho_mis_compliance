import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { assetDisposalService } from "./assetDisposal.service.js";

export class AssetDisposalController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset disposals fetched", await assetDisposalService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset disposal created", await assetDisposalService.create(request.body, request.context), 201);
  };
}

export const assetDisposalController = new AssetDisposalController();
