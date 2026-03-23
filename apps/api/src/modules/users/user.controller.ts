import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { userService } from "./user.service.js";

export class UserController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await userService.list();
    sendSuccess(response, "Users fetched", data);
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    const data = await userService.getById(String(request.params.id));
    sendSuccess(response, "User fetched", data);
  };

  options = async (_request: Request, response: Response): Promise<void> => {
    const data = await userService.options();
    sendSuccess(response, "User options fetched", data);
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const data = await userService.create(request.body, request.context);
    sendSuccess(response, "User created", data, 201);
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const data = await userService.update(String(request.params.id), request.body, request.context);
    sendSuccess(response, "User updated", data);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await userService.delete(String(request.params.id), request.context);
    sendSuccess(response, "User deleted", null);
  };
}

export const userController = new UserController();
