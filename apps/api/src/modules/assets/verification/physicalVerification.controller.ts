import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { physicalVerificationService } from "./physicalVerification.service.js";

export class PhysicalVerificationController {
  list = async (_request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Asset verification records fetched", await physicalVerificationService.list());
  };
}

export const physicalVerificationController = new PhysicalVerificationController();
