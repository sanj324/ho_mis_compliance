import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { brokerRepository } from "./broker.repository.js";

const prisma = new PrismaClient();

export class BrokerService {
  list() {
    return brokerRepository.findMany();
  }

  async create(
    input: { code: string; name: string; registrationNo?: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const broker = await brokerRepository.create({
      code: input.code,
      name: input.name,
      ...(input.registrationNo ? { registrationNo: input.registrationNo } : {})
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "Broker",
        entityId: broker.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: broker
      }
    });

    return broker;
  }
}

export const brokerService = new BrokerService();
