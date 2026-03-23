import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { depreciationMethodRepository } from "./depreciationMethod.repository.js";

const prisma = new PrismaClient();

export class DepreciationMethodService {
  list() {
    return depreciationMethodRepository.findMany();
  }

  async create(
    input: { code: string; name: string; calculationType: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const method = await depreciationMethodRepository.create(input);
    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "DepreciationMethod",
        entityId: method.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: method
      }
    });
    return method;
  }
}

export const depreciationMethodService = new DepreciationMethodService();
