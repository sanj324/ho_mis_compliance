import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { exposureService } from "./exposure.service.js";

export class ExposureController {
  checks = async (request: Request, response: Response): Promise<void> => {
    const data = await exposureService.checks(request.query.branchId as string | undefined);
    sendSuccess(response, "Exposure checks fetched", data);
  };
}

export const exposureController = new ExposureController();
