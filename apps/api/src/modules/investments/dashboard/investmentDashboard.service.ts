import { PrismaClient } from "@prisma/client";

import { maturityService } from "../maturity/maturity.service.js";

const prisma = new PrismaClient();

export class InvestmentDashboardService {
  async summary(branchId?: string) {
    const investments = branchId
      ? await prisma.investment.findMany({ where: { branchId } })
      : await prisma.investment.findMany();

    const totalBookValue = investments.reduce((sum, item) => sum + Number(item.bookValue), 0);
    const totalMarketValue = investments.reduce((sum, item) => sum + Number(item.marketValue ?? 0), 0);
    const byClassification = new Map<string, { count: number; bookValue: number }>();
    const byRating = new Map<string, { count: number; bookValue: number }>();
    const byMaturityBucket = new Map<string, { count: number; bookValue: number }>();

    for (const investment of investments) {
      const classificationCurrent = byClassification.get(investment.classification) ?? { count: 0, bookValue: 0 };
      byClassification.set(investment.classification, {
        count: classificationCurrent.count + 1,
        bookValue: classificationCurrent.bookValue + Number(investment.bookValue)
      });

      const ratingKey = investment.rating ?? "UNRATED";
      const ratingCurrent = byRating.get(ratingKey) ?? { count: 0, bookValue: 0 };
      byRating.set(ratingKey, {
        count: ratingCurrent.count + 1,
        bookValue: ratingCurrent.bookValue + Number(investment.bookValue)
      });

      const bucket = maturityService.getBucket(investment.maturityDate);
      const bucketCurrent = byMaturityBucket.get(bucket) ?? { count: 0, bookValue: 0 };
      byMaturityBucket.set(bucket, {
        count: bucketCurrent.count + 1,
        bookValue: bucketCurrent.bookValue + Number(investment.bookValue)
      });
    }

    return {
      totalCount: investments.length,
      totalBookValue,
      totalMarketValue,
      byClassification: Array.from(byClassification.entries()).map(([classification, values]) => ({
        classification,
        count: values.count,
        bookValue: values.bookValue
      })),
      byRating: Array.from(byRating.entries()).map(([rating, values]) => ({
        rating,
        count: values.count,
        bookValue: values.bookValue
      })),
      byMaturityBucket: Array.from(byMaturityBucket.entries()).map(([bucket, values]) => ({
        bucket,
        count: values.count,
        bookValue: values.bookValue
      }))
    };
  }
}

export const investmentDashboardService = new InvestmentDashboardService();
