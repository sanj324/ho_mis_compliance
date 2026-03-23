import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { attendanceRepository } from "./attendance.repository.js";

export class AttendanceService {
  list(filters: { branchId?: string; month?: number; year?: number }) {
    return attendanceRepository.findMany(filters);
  }

  async bulkUpsert(
    input: { records: Array<{ employeeId: string; branchId: string; attendanceDate: string; status: string; attendanceUnits?: number }> },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const data = await attendanceRepository.upsertMany(
      input.records.map((record) => ({
        employeeId: record.employeeId,
        branchId: record.branchId,
        attendanceDate: new Date(record.attendanceDate),
        status: record.status,
        attendanceUnits: record.attendanceUnits ?? 1
      }))
    );

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "AttendanceRecord",
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: { count: data.length }
    });

    return data;
  }
}

export const attendanceService = new AttendanceService();
