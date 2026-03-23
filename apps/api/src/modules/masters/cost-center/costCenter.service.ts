import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { costCenterRepository } from "./costCenter.repository.js";

export class CostCenterService {
  list(branchId?: string) {
    return costCenterRepository.findMany(branchId);
  }

  async create(
    input: {
      code: string;
      name: string;
      branchId?: string;
      isActive?: boolean;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const costCenter = await costCenterRepository.create({
      code: input.code,
      name: input.name,
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    });

    await auditService.record({
      moduleName: "COST_CENTERS",
      entityName: "CostCenter",
      entityId: costCenter.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: costCenter
    });

    return costCenter;
  }

  async update(
    id: string,
    input: {
      name?: string;
      branchId?: string | null;
      isActive?: boolean;
      approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existing = await costCenterRepository.findById(id);
    if (!existing) {
      throw new AppError("Cost center not found", StatusCodes.NOT_FOUND);
    }

    const costCenter = await costCenterRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.branchId !== undefined ? (input.branchId ? { branch: { connect: { id: input.branchId } } } : { branch: { disconnect: true } }) : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.approvalState !== undefined ? { approvalState: input.approvalState } : {})
    });

    await auditService.record({
      moduleName: "COST_CENTERS",
      entityName: "CostCenter",
      entityId: costCenter.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: costCenter
    });

    return costCenter;
  }

  async delete(id: string, context: { requestId: string; userId: string | null; branchId: string | null }) {
    const existing = await costCenterRepository.findById(id);
    if (!existing) {
      throw new AppError("Cost center not found", StatusCodes.NOT_FOUND);
    }

    if (existing._count.employees > 0 || existing._count.assets > 0) {
      throw new AppError("Cost center is in use and cannot be deleted", StatusCodes.CONFLICT);
    }

    await costCenterRepository.delete(id);

    await auditService.record({
      moduleName: "COST_CENTERS",
      entityName: "CostCenter",
      entityId: existing.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: { deleted: true }
    });
  }
}

export const costCenterService = new CostCenterService();
