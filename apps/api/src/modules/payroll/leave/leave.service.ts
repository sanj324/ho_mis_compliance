import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { leaveRepository } from "./leave.repository.js";

export class LeaveService {
  list(employeeId?: string) {
    return leaveRepository.findMany(employeeId);
  }

  async create(
    input: { employeeId: string; leaveType: string; startDate: string; endDate: string; totalDays: number; remarks?: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const record = await leaveRepository.create({
      employee: { connect: { id: input.employeeId } },
      leaveType: input.leaveType,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      totalDays: input.totalDays,
      ...(input.remarks ? { remarks: input.remarks } : {})
    });

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "LeaveRecord",
      entityId: record.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: record
    });

    return record;
  }
}

export const leaveService = new LeaveService();
