import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { counterpartyRepository } from "./counterparty.repository.js";

const prisma = new PrismaClient();

export class CounterpartyService {
  list() {
    return counterpartyRepository.findMany();
  }

  async create(
    input: { code: string; name: string; exposureLimit?: number; isActive?: boolean },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const counterparty = await counterpartyRepository.create({
      code: input.code,
      name: input.name,
      ...(input.exposureLimit !== undefined ? { exposureLimit: input.exposureLimit } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "Counterparty",
        entityId: counterparty.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: counterparty
      }
    });

    return counterparty;
  }
}

export const counterpartyService = new CounterpartyService();
