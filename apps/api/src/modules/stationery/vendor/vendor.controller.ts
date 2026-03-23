import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { vendorService } from "./vendor.service.js";

export class VendorController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Vendors fetched", await vendorService.list());
  };

  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Vendor created", await vendorService.create(request.body, request.context), 201);
  };
}

export const vendorController = new VendorController();
