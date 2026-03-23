import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { issueService } from "./issue.service.js";

export class IssueController {
  create = async (request: Request, response: Response): Promise<void> => {
    sendSuccess(response, "Stock issue created", await issueService.create(request.body, request.context), 201);
  };
}

export const issueController = new IssueController();
