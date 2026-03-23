import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { employeeService } from "./employee.service.js";

export class EmployeeController {
  list = async (request: Request, response: Response): Promise<void> => {
    const filters = {
      ...(request.query.branchId ? { branchId: String(request.query.branchId) } : {}),
      ...(request.query.departmentId ? { departmentId: String(request.query.departmentId) } : {}),
      ...(request.query.activeStatus !== undefined
        ? { activeStatus: String(request.query.activeStatus).toLowerCase() === "true" }
        : {})
    };
    const data = await employeeService.list(filters);
    sendSuccess(response, "Employees fetched", data);
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    const data = await employeeService.getById(String(request.params.id));
    sendSuccess(response, "Employee fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await employeeService.create(request.body, request.context);
    sendSuccess(response, "Employee created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await employeeService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Employee updated", data);
  };
}

export const employeeController = new EmployeeController();
