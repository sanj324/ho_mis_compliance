import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { insuranceRepository } from "./insurance.repository.js";

const prisma = new PrismaClient();

export class InsuranceService {
  list() {
    return insuranceRepository.findMany();
  }

  async create(
    input: {
      assetId: string;
      policyNo: string;
      insurerName: string;
      startDate: string;
      expiryDate: string;
      insuredValue: number;
      premiumAmount?: number;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const insurance = await insuranceRepository.create({
      asset: { connect: { id: input.assetId } },
      policyNo: input.policyNo,
      insurerName: input.insurerName,
      startDate: new Date(input.startDate),
      expiryDate: new Date(input.expiryDate),
      insuredValue: input.insuredValue,
      ...(input.premiumAmount !== undefined ? { premiumAmount: input.premiumAmount } : {})
    });

    await prisma.asset.update({
      where: { id: input.assetId },
      data: {
        insurancePolicyNo: input.policyNo,
        insuranceExpiryDate: new Date(input.expiryDate)
      }
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "AssetInsurance",
        entityId: insurance.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: insurance
      }
    });
    return insurance;
  }
}

export const insuranceService = new InsuranceService();
