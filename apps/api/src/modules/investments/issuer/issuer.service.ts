import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { issuerRepository } from "./issuer.repository.js";

const prisma = new PrismaClient();

export class IssuerService {
  list() {
    return issuerRepository.findMany();
  }

  async create(
    input: { code: string; name: string; issuerType: string; riskLimit?: number },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const issuer = await issuerRepository.create({
      code: input.code,
      name: input.name,
      issuerType: input.issuerType,
      ...(input.riskLimit !== undefined ? { riskLimit: input.riskLimit } : {})
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "Issuer",
        entityId: issuer.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: issuer
      }
    });

    return issuer;
  }
}

export const issuerService = new IssuerService();
