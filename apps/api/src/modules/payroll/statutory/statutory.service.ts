import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { statutoryRepository } from "./statutory.repository.js";

export class StatutoryService {
  getCurrent(branchId?: string) {
    return statutoryRepository.findCurrent(branchId);
  }

  async create(
    input: {
      branchId?: string;
      effectiveFrom: string;
      pfRateEmployee?: number;
      pfRateEmployer?: number;
      esiRateEmployee?: number;
      esiRateEmployer?: number;
      professionalTax?: number;
      tdsRate?: number;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const setup = await statutoryRepository.create({
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      effectiveFrom: new Date(input.effectiveFrom),
      pfRateEmployee: input.pfRateEmployee ?? 12,
      pfRateEmployer: input.pfRateEmployer ?? 12,
      esiRateEmployee: input.esiRateEmployee ?? 0.75,
      esiRateEmployer: input.esiRateEmployer ?? 3.25,
      professionalTax: input.professionalTax ?? 200,
      tdsRate: input.tdsRate ?? 10
    });

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "StatutorySetup",
      entityId: setup.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: context.branchId,
      newValues: setup
    });

    return setup;
  }
}

export const statutoryService = new StatutoryService();
