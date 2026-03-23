import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { accrualRepository } from "./accrual.repository.js";

const prisma = new PrismaClient();

export class AccrualService {
  async createAccrual(
    investmentId: string,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId }
    });

    if (!investment) {
      throw new Error("Investment not found");
    }

    const accrualDate = new Date();
    const annualCoupon = Number(investment.faceValue) * (Number(investment.couponRate ?? 0) / 100);
    const accrualAmount = Number((annualCoupon / 365).toFixed(2));

    const accrual = await accrualRepository.create({
      investment: { connect: { id: investmentId } },
      accrualDate,
      accrualAmount
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "InvestmentAccrual",
        entityId: accrual.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: accrual
      }
    });

    return accrual;
  }
}

export const accrualService = new AccrualService();
