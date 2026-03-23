import { PrismaClient } from "@prisma/client";

import { maturityService } from "../maturity/maturity.service.js";

const prisma = new PrismaClient();

export class InvestmentReportService {
  async register(branchId?: string) {
    const investments = branchId
      ? await prisma.investment.findMany({
          where: { branchId },
          include: {
            securityType: true,
            issuer: true,
            counterparty: true,
            broker: true
          },
          orderBy: {
            purchaseDate: "desc"
          }
        })
      : await prisma.investment.findMany({
          include: {
            securityType: true,
            issuer: true,
            counterparty: true,
            broker: true
          },
          orderBy: {
            purchaseDate: "desc"
          }
        });

    return investments.map((investment) => ({
      investmentCode: investment.investmentCode,
      securityName: investment.securityName,
      classification: investment.classification,
      issuer: investment.issuer?.name ?? "-",
      counterparty: investment.counterparty?.name ?? "-",
      maturityDate: investment.maturityDate?.toISOString().slice(0, 10) ?? "-",
      bookValue: Number(investment.bookValue).toFixed(2),
      marketValue: Number(investment.marketValue ?? 0).toFixed(2),
      rating: investment.rating ?? "UNRATED"
    }));
  }

  async maturityLadder(branchId?: string) {
    const investments = branchId
      ? await prisma.investment.findMany({ where: { branchId } })
      : await prisma.investment.findMany();

    const buckets = new Map<string, { count: number; totalBookValue: number }>();
    for (const investment of investments) {
      const bucket = maturityService.getBucket(investment.maturityDate);
      const current = buckets.get(bucket) ?? { count: 0, totalBookValue: 0 };
      buckets.set(bucket, {
        count: current.count + 1,
        totalBookValue: current.totalBookValue + Number(investment.bookValue)
      });
    }

    return Array.from(buckets.entries()).map(([bucket, values]) => ({
      bucket,
      count: values.count,
      totalBookValue: values.totalBookValue
    }));
  }

  async exposureSummary(branchId?: string) {
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

    const totalBookValue = investments.reduce((sum, investment) => sum + Number(investment.bookValue), 0);
    const rows: Array<{
      category: string;
      name: string;
      totalBookValue: number;
      percentageOfPortfolio: number;
    }> = [];

    const byIssuer = new Map<string, number>();
    const byCounterparty = new Map<string, number>();

    for (const investment of investments) {
      const bookValue = Number(investment.bookValue);
      if (investment.issuer) {
        byIssuer.set(investment.issuer.name, (byIssuer.get(investment.issuer.name) ?? 0) + bookValue);
      }
      if (investment.counterparty) {
        byCounterparty.set(investment.counterparty.name, (byCounterparty.get(investment.counterparty.name) ?? 0) + bookValue);
      }
    }

    for (const [name, amount] of byIssuer.entries()) {
      rows.push({
        category: "ISSUER",
        name,
        totalBookValue: amount,
        percentageOfPortfolio: totalBookValue > 0 ? (amount / totalBookValue) * 100 : 0
      });
    }

    for (const [name, amount] of byCounterparty.entries()) {
      rows.push({
        category: "COUNTERPARTY",
        name,
        totalBookValue: amount,
        percentageOfPortfolio: totalBookValue > 0 ? (amount / totalBookValue) * 100 : 0
      });
    }

    return rows;
  }
}

export const investmentReportService = new InvestmentReportService();
