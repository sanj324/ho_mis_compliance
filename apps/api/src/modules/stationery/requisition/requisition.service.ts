import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { RequisitionStatusEnum } from "../../../common/enums/inventory.enum.js";
import { requisitionRepository } from "./requisition.repository.js";

const prisma = new PrismaClient();

export class RequisitionService {
  async create(
    input: {
      branchId: string;
      vendorId?: string;
      requisitionDate: string;
      remarks?: string;
      items: Array<{ itemId: string; quantity: number }>;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const requisitionNo = `REQ-${Date.now()}`;
    const requisition = await requisitionRepository.create({
      requisitionNo,
      branch: { connect: { id: input.branchId } },
      ...(input.vendorId ? { vendor: { connect: { id: input.vendorId } } } : {}),
      requisitionDate: new Date(input.requisitionDate),
      status: RequisitionStatusEnum.PENDING,
      approvalState: "PENDING_APPROVAL",
      ...(input.remarks ? { remarks: input.remarks } : {}),
      items: {
        create: input.items.map((item) => ({
          item: { connect: { id: item.itemId } },
          quantity: item.quantity
        }))
      }
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "STATIONERY",
        entityName: "Requisition",
        entityId: requisition.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
        newValues: requisition
      }
    });

    return requisition;
  }
}

export const requisitionService = new RequisitionService();
