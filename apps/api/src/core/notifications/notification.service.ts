import { StatusCodes } from "http-status-codes";

import { AppError } from "../../common/errors/app-error.js";
import { notificationRepository } from "./notification.repository.js";

export class NotificationService {
  list(userId?: string) {
    return notificationRepository.list(userId);
  }

  create(input: {
    userId?: string | null;
    branchId?: string | null;
    moduleName: "COMPLIANCE" | "NOTIFICATIONS" | "DOCUMENTS" | "LEDGER" | "PAYROLL" | "INVESTMENTS" | "ASSETS" | "STATIONERY" | "SHARE_CAPITAL";
    title: string;
    message: string;
    severity: string;
    referenceType?: string;
    referenceId?: string;
  }) {
    return notificationRepository.create({
      ...(input.userId ? { user: { connect: { id: input.userId } } } : {}),
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      moduleName: input.moduleName,
      title: input.title,
      message: input.message,
      severity: input.severity,
      ...(input.referenceType ? { referenceType: input.referenceType } : {}),
      ...(input.referenceId ? { referenceId: input.referenceId } : {})
    });
  }

  async markRead(id: string) {
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new AppError("Notification not found", StatusCodes.NOT_FOUND);
    }

    return notificationRepository.markRead(id);
  }
}

export const notificationService = new NotificationService();
