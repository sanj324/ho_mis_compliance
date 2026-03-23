import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../common/errors/app-error.js";
import { AuditActionEnum } from "../../common/enums/audit-action.enum.js";
import { ModuleName } from "../../common/enums/module-name.enum.js";
import { hashPassword } from "../../common/utils/password.js";
import { auditService } from "../../core/audit/audit.service.js";
import { userRepository } from "./user.repository.js";

const prisma = new PrismaClient();

export class UserService {
  list() {
    return userRepository.findMany();
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return user;
  }

  async create(
    input: {
      username: string;
      fullName: string;
      email?: string;
      password: string;
      branchId?: string | null;
      roleIds: string[];
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      username: input.username,
      fullName: input.fullName,
      ...(input.email !== undefined ? { email: input.email } : {}),
      passwordHash,
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      userRoles: {
        create: input.roleIds.map((roleId) => ({
          role: { connect: { id: roleId } }
        }))
      }
    });

    await auditService.record({
      moduleName: ModuleName.USERS,
      entityName: "User",
      entityId: user.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: user
    });

    return user;
  }

  async update(
    id: string,
    input: {
      fullName?: string;
      email?: string;
      branchId?: string | null;
      isActive?: boolean;
      approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const user = await userRepository.update(id, {
      ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.approvalState !== undefined ? { approvalState: input.approvalState } : {}),
      ...(input.branchId === undefined
        ? {}
        : input.branchId === null
          ? { branch: { disconnect: true } }
          : { branch: { connect: { id: input.branchId } } })
    });

    await auditService.record({
      moduleName: ModuleName.USERS,
      entityName: "User",
      entityId: user.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: user
    });

    return user;
  }

  async delete(id: string, context: { requestId: string; userId: string | null; branchId: string | null }) {
    if (context.userId === id) {
      throw new AppError("You cannot delete your own user account", StatusCodes.CONFLICT);
    }

    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const dependentRecords =
      existing._count.auditLogs +
      existing._count.finalizedPayrollRuns +
      existing._count.notifications +
      existing._count.documents +
      existing._count.vouchers +
      existing._count.generatedReports +
      existing._count.assignedApprovalTasks +
      existing._count.approvalHistories;

    if (dependentRecords > 0) {
      throw new AppError("User is in use and cannot be deleted", StatusCodes.CONFLICT);
    }

    await userRepository.delete(id);

    await auditService.record({
      moduleName: ModuleName.USERS,
      entityName: "User",
      entityId: existing.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      oldValues: existing,
      newValues: { deleted: true }
    });
  }

  roleOptions() {
    return prisma.role.findMany({
      orderBy: { name: "asc" }
    });
  }

  async options() {
    const [roles, branches] = await Promise.all([
      prisma.role.findMany({
        orderBy: { name: "asc" }
      }),
      prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" }
      })
    ]);

    return { roles, branches };
  }
}

export const userService = new UserService();
