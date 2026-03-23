import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { salaryStructureRepository } from "./salaryStructure.repository.js";

export class SalaryStructureService {
  list(branchId?: string) {
    return salaryStructureRepository.findMany(branchId);
  }

  async create(
    input: {
      employeeId: string;
      effectiveFrom: string;
      basicPay: number;
      hra?: number;
      specialAllowance?: number;
      conveyanceAllowance?: number;
      otherAllowance?: number;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const structure = await salaryStructureRepository.create({
      employee: { connect: { id: input.employeeId } },
      effectiveFrom: new Date(input.effectiveFrom),
      basicPay: input.basicPay,
      hra: input.hra ?? 0,
      specialAllowance: input.specialAllowance ?? 0,
      conveyanceAllowance: input.conveyanceAllowance ?? 0,
      otherAllowance: input.otherAllowance ?? 0
    });

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "SalaryStructure",
      entityId: structure.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: structure
    });

    return structure;
  }
}

export const salaryStructureService = new SalaryStructureService();
