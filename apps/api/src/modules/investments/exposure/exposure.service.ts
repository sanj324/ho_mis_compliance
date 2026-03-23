import { PrismaClient } from "@prisma/client";

import { InvestmentExceptionSeverityEnum } from "../../../common/enums/investment.enum.js";

const prisma = new PrismaClient();

export class ExposureService {
  async checks(branchId?: string) {
    const investments = branchId
      ? await prisma.investment.findMany({
          where: { branchId },
          include: {
            issuer: true,
            counterparty: true
          }
        })
      : await prisma.investment.findMany({
          include: {
            issuer: true,
            counterparty: true
          }
        });

    const byIssuer = new Map<string, number>();
    const byCounterparty = new Map<string, number>();
    const exceptions: Array<Record<string, unknown>> = [];
    const totalBookValue = investments.reduce((sum, investment) => sum + Number(investment.bookValue), 0);

    for (const investment of investments) {
      const bookValue = Number(investment.bookValue);

      if (investment.issuer) {
        const current = byIssuer.get(investment.issuer.name) ?? 0;
        const next = current + bookValue;
        byIssuer.set(investment.issuer.name, next);

        if (investment.issuer.riskLimit && next > Number(investment.issuer.riskLimit)) {
          exceptions.push({
            investmentCode: investment.investmentCode,
            exceptionCode: "ISSUER_LIMIT_BREACH",
            severity: InvestmentExceptionSeverityEnum.HIGH,
            message: `${investment.issuer.name} exposure exceeds configured risk limit`
          });
        }
      }

      if (investment.counterparty) {
        const current = byCounterparty.get(investment.counterparty.name) ?? 0;
        const next = current + bookValue;
        byCounterparty.set(investment.counterparty.name, next);

        if (investment.counterparty.exposureLimit && next > Number(investment.counterparty.exposureLimit)) {
          exceptions.push({
            investmentCode: investment.investmentCode,
            exceptionCode: "COUNTERPARTY_LIMIT_BREACH",
            severity: InvestmentExceptionSeverityEnum.HIGH,
            message: `${investment.counterparty.name} exposure exceeds counterparty limit`
          });
        }
      }

      if (investment.policyLimit && bookValue > Number(investment.policyLimit)) {
        exceptions.push({
          investmentCode: investment.investmentCode,
          exceptionCode: "POLICY_LIMIT_BREACH",
          severity: InvestmentExceptionSeverityEnum.MEDIUM,
          message: `${investment.investmentCode} exceeds configured policy limit`
        });
      }
    }

    return {
      issuerExposure: Array.from(byIssuer.entries()).map(([issuerName, amount]) => ({
        issuerName,
        totalBookValue: amount,
        percentageOfPortfolio: totalBookValue > 0 ? (amount / totalBookValue) * 100 : 0
      })),
      counterpartyExposure: Array.from(byCounterparty.entries()).map(([counterpartyName, amount]) => ({
        counterpartyName,
        totalBookValue: amount,
        percentageOfPortfolio: totalBookValue > 0 ? (amount / totalBookValue) * 100 : 0
      })),
      exceptions
    };
  }
}

export const exposureService = new ExposureService();
