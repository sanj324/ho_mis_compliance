import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { designationRepository } from "./designation.repository.js";

export class DesignationService {
  list(branchId?: string) {
    return designationRepository.findMany(branchId);
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
    const designation = await designationRepository.create({
      code: input.code,
      name: input.name,
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    });

    await auditService.record({
      moduleName: "DESIGNATIONS",
      entityName: "Designation",
      entityId: designation.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: designation
    });

    return designation;
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
    const existing = await designationRepository.findById(id);
    if (!existing) {
      throw new AppError("Designation not found", StatusCodes.NOT_FOUND);
    }

    const designation = await designationRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.branchId !== undefined ? (input.branchId ? { branch: { connect: { id: input.branchId } } } : { branch: { disconnect: true } }) : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.approvalState !== undefined ? { approvalState: input.approvalState } : {})
    });

    await auditService.record({
      moduleName: "DESIGNATIONS",
      entityName: "Designation",
      entityId: designation.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: designation
    });

    return designation;
  }

  async delete(id: string, context: { requestId: string; userId: string | null; branchId: string | null }) {
    const existing = await designationRepository.findById(id);
    if (!existing) {
      throw new AppError("Designation not found", StatusCodes.NOT_FOUND);
    }

    if (existing._count.employees > 0) {
      throw new AppError("Designation is in use and cannot be deleted", StatusCodes.CONFLICT);
    }

    await designationRepository.delete(id);

    await auditService.record({
      moduleName: "DESIGNATIONS",
      entityName: "Designation",
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

export const designationService = new DesignationService();
