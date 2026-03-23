import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { notificationService } from "./notification.service.js";

export class NotificationController {
  async list(request: Request, response: Response) {
    const notifications = await notificationService.list(request.context.userId ?? undefined);
    sendSuccess(response, "Notifications fetched successfully", notifications);
  }

  async read(request: Request, response: Response) {
    const notification = await notificationService.markRead(typeof request.params.id === "string" ? request.params.id : "");
    sendSuccess(response, "Notification marked as read", notification);
  }
}

export const notificationController = new NotificationController();
