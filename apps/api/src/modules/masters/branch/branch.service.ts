import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { ModuleName } from "../../../common/enums/module-name.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { branchRepository } from "./branch.repository.js";

export class BranchService {
  list() {
    return branchRepository.findMany();
  }

  async create(
    input: {
      code: string;
      name: string;
      addressLine1?: string;
      city?: string;
      state?: string;
      isHeadOffice?: boolean;
    },
    context: {
      requestId: string;
      userId: string | null;
      branchId: string | null;
    }
  ) {
    const branch = await branchRepository.create({
      code: input.code,
      name: input.name,
      ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1 } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.state !== undefined ? { state: input.state } : {}),
      isHeadOffice: input.isHeadOffice ?? false
    });

    await auditService.record({
      moduleName: ModuleName.BRANCHES,
      entityName: "Branch",
      entityId: branch.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: branch
    });

    return branch;
  }

  async update(
    id: string,
    input: {
      name?: string;
      addressLine1?: string;
      city?: string;
      state?: string;
      isHeadOffice?: boolean;
      isActive?: boolean;
      approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
    },
    context: {
      requestId: string;
      userId: string | null;
      branchId: string | null;
    }
  ) {
    const existing = await branchRepository.findById(id);
    if (!existing) {
      throw new AppError("Branch not found", 404);
    }

    const branch = await branchRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1 } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.state !== undefined ? { state: input.state } : {}),
      ...(input.isHeadOffice !== undefined ? { isHeadOffice: input.isHeadOffice } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.approvalState !== undefined ? { approvalState: input.approvalState } : {})
    });

    await auditService.record({
      moduleName: ModuleName.BRANCHES,
      entityName: "Branch",
      entityId: branch.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: branch
    });

    return branch;
  }

  async delete(
    id: string,
    context: {
      requestId: string;
      userId: string | null;
      branchId: string | null;
    }
  ) {
    const existing = await branchRepository.findById(id);
    if (!existing) {
      throw new AppError("Branch not found", StatusCodes.NOT_FOUND);
    }

    const relationCounts = existing._count;
    const dependentRecords = Object.values(relationCounts).reduce((sum, count) => sum + count, 0);
    if (dependentRecords > 0) {
      throw new AppError("Branch is in use and cannot be deleted", StatusCodes.CONFLICT);
    }

    await branchRepository.delete(id);

    await auditService.record({
      moduleName: ModuleName.BRANCHES,
      entityName: "Branch",
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

export const branchService = new BranchService();
