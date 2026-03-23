import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { attendanceService } from "./attendance.service.js";

export class AttendanceController {
  list = async (request: Request, response: Response): Promise<void> => {
    const filters = {
      ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
      ...(request.query.month ? { month: Number(request.query.month) } : {}),
      ...(request.query.year ? { year: Number(request.query.year) } : {})
    };
    const data = await attendanceService.list(filters);
    sendSuccess(response, "Attendance records fetched", data);
  };

  bulkUpsert = async (request: Request, response: Response): Promise<void> => {
    const data = await attendanceService.bulkUpsert(request.body, request.context);
    sendSuccess(response, "Attendance records processed", data);
  };
}

export const attendanceController = new AttendanceController();
