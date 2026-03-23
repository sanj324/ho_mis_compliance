import { notificationService } from "../notifications/notification.service.js";
import { complianceRepository } from "./compliance.repository.js";
import { evaluateAssetRules } from "./rules/asset.rules.js";
import { evaluateInvestmentRules } from "./rules/investment.rules.js";
import { evaluatePayrollRules } from "./rules/payroll.rules.js";
import { evaluateShareCapitalRules } from "./rules/shareCapital.rules.js";
import { evaluateStationeryRules } from "./rules/stationery.rules.js";

type ComplianceCandidate = {
  moduleName: "PAYROLL" | "INVESTMENTS" | "ASSETS" | "STATIONERY" | "SHARE_CAPITAL";
  entityType: string;
  entityId: string;
  ruleCode: string;
  ruleDescription: string;
  severity: string;
  branchId: string | null;
  dueDate: Date | null;
};

export class ComplianceEngineService {
  async evaluateModule(moduleName?: string) {
    const batches: ComplianceCandidate[][] = [];

    if (!moduleName || moduleName === "PAYROLL") {
      batches.push(await evaluatePayrollRules());
    }
    if (!moduleName || moduleName === "INVESTMENTS") {
      batches.push(await evaluateInvestmentRules());
    }
    if (!moduleName || moduleName === "ASSETS") {
      batches.push(await evaluateAssetRules());
    }
    if (!moduleName || moduleName === "STATIONERY") {
      batches.push(await evaluateStationeryRules());
    }
    if (!moduleName || moduleName === "SHARE_CAPITAL") {
      batches.push(await evaluateShareCapitalRules());
    }

    const createdEvents = [];
    for (const candidate of batches.flat()) {
      const existing = await complianceRepository.findOpenEvent(candidate);
      if (existing) {
        continue;
      }

      const event = await complianceRepository.createEvent({
        moduleName: candidate.moduleName,
        entityType: candidate.entityType,
        entityId: candidate.entityId,
        ruleCode: candidate.ruleCode,
        ruleDescription: candidate.ruleDescription,
        severity: candidate.severity,
        ...(candidate.branchId ? { branch: { connect: { id: candidate.branchId } } } : {}),
        ...(candidate.dueDate ? { dueDate: candidate.dueDate } : {})
      });
      createdEvents.push(event);

      await notificationService.create({
        branchId: candidate.branchId,
        moduleName: "COMPLIANCE",
        title: `${candidate.moduleName} compliance alert`,
        message: `${candidate.ruleCode}: ${candidate.ruleDescription}`,
        severity: candidate.severity === "HIGH" ? "CRITICAL" : "WARNING",
        referenceType: candidate.entityType,
        referenceId: candidate.entityId
      });
    }

    return createdEvents;
  }
}

export const complianceEngineService = new ComplianceEngineService();
