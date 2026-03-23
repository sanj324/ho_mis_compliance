import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { leaveService } from "./leave.service.js";

export class LeaveController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await leaveService.list(request.query.employeeId as string | undefined);
    sendSuccess(response, "Leave records fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await leaveService.create(request.body, request.context);
    sendSuccess(response, "Leave record created", data, 201);
  };
}

export const leaveController = new LeaveController();
