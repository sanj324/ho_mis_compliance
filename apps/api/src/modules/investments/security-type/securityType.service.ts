import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { securityTypeRepository } from "./securityType.repository.js";

const prisma = new PrismaClient();

export class SecurityTypeService {
  list() {
    return securityTypeRepository.findMany();
  }

  async create(
    input: { code: string; name: string; category: string; slrEligible?: boolean },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const securityType = await securityTypeRepository.create({
      code: input.code,
      name: input.name,
      category: input.category,
      slrEligible: input.slrEligible ?? false
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "SecurityType",
        entityId: securityType.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: securityType
      }
    });

    return securityType;
  }
}

export const securityTypeService = new SecurityTypeService();
