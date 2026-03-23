import type { Prisma } from "@prisma/client";

import { auditRepository } from "./audit.repository.js";

export type CreateAuditInput = {
  moduleName:
    | "AUTH"
    | "USERS"
    | "BRANCHES"
    | "AUDIT"
    | "DASHBOARD"
    | "DEPARTMENTS"
    | "DESIGNATIONS"
    | "COST_CENTERS"
    | "PAYROLL";
  entityName: string;
  entityId?: string | null;
  action: "LOGIN" | "REFRESH" | "CREATE" | "UPDATE" | "VIEW";
  requestId: string;
  userId?: string | null;
  branchId?: string | null;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
};

export class AuditService {
  record(input: CreateAuditInput) {
    const data = {
      moduleName: input.moduleName,
      entityName: input.entityName,
      entityId: input.entityId ?? null,
      action: input.action,
      requestId: input.requestId,
      ...(input.userId ? { user: { connect: { id: input.userId } } } : {}),
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.oldValues !== undefined ? { oldValues: input.oldValues } : {}),
      ...(input.newValues !== undefined ? { newValues: input.newValues } : {})
    };

    return auditRepository.create(data);
  }

  list() {
    return auditRepository.list();
  }
}

export const auditService = new AuditService();
