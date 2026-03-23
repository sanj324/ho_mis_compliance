import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { shareClassRepository } from "./shareClass.repository.js";

const prisma = new PrismaClient();

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class ShareClassService {
  list() {
    return shareClassRepository.list();
  }

  async create(
    input: { code: string; name: string; faceValue: number; dividendRate?: number; isActive?: boolean },
    context: AuditContext
  ) {
    const shareClass = await shareClassRepository.create({
      code: input.code,
      name: input.name,
      faceValue: input.faceValue,
      ...(input.dividendRate !== undefined ? { dividendRate: input.dividendRate } : {}),
      isActive: input.isActive ?? true
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "ShareClass",
        entityId: shareClass.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: shareClass
      }
    });

    return shareClass;
  }
}

export const shareClassService = new ShareClassService();
