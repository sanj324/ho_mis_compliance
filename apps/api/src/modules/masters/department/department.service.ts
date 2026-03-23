import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { departmentRepository } from "./department.repository.js";

export class DepartmentService {
  list(branchId?: string) {
    return departmentRepository.findMany(branchId);
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
    const department = await departmentRepository.create({
      code: input.code,
      name: input.name,
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    });

    await auditService.record({
      moduleName: "DEPARTMENTS",
      entityName: "Department",
      entityId: department.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: department
    });

    return department;
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
    const existing = await departmentRepository.findById(id);
    if (!existing) {
      throw new AppError("Department not found", StatusCodes.NOT_FOUND);
    }

    const department = await departmentRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.branchId !== undefined ? (input.branchId ? { branch: { connect: { id: input.branchId } } } : { branch: { disconnect: true } }) : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.approvalState !== undefined ? { approvalState: input.approvalState } : {})
    });

    await auditService.record({
      moduleName: "DEPARTMENTS",
      entityName: "Department",
      entityId: department.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: department
    });

    return department;
  }

  async delete(id: string, context: { requestId: string; userId: string | null; branchId: string | null }) {
    const existing = await departmentRepository.findById(id);
    if (!existing) {
      throw new AppError("Department not found", StatusCodes.NOT_FOUND);
    }

    if (existing._count.employees > 0 || existing._count.assets > 0) {
      throw new AppError("Department is in use and cannot be deleted", StatusCodes.CONFLICT);
    }

    await departmentRepository.delete(id);

    await auditService.record({
      moduleName: "DEPARTMENTS",
      entityName: "Department",
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

export const departmentService = new DepartmentService();
