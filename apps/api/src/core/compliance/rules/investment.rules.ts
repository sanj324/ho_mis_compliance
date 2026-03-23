import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const evaluateInvestmentRules = async () => {
  const investments = await prisma.investment.findMany({
    where: {
      OR: [
        { maturityDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
        { rating: null }
      ]
    }
  });

  return investments.map((investment) => ({
    moduleName: "INVESTMENTS" as const,
    entityType: "Investment",
    entityId: investment.id,
    ruleCode: investment.rating ? "INVESTMENT_MATURITY_ALERT" : "INVESTMENT_RATING_MISSING",
    ruleDescription: investment.rating
      ? "Investment maturity falls within the next 30 days"
      : "Investment rating is not captured",
    severity: investment.rating ? "MEDIUM" : "HIGH",
    branchId: investment.branchId,
    dueDate: investment.maturityDate
  }));
};
