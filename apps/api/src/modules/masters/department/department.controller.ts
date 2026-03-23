import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/response.js";
import { departmentService } from "./department.service.js";

export class DepartmentController {
  list = async (request: Request, response: Response): Promise<void> => {
    const data = await departmentService.list(request.query.branchId as string | undefined);
    sendSuccess(response, "Departments fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await departmentService.create(request.body, request.context);
    sendSuccess(response, "Department created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await departmentService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "Department updated", data);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await departmentService.delete(String(request.params.id), request.context);
    sendSuccess(response, "Department deleted", null);
  };
}

export const departmentController = new DepartmentController();
