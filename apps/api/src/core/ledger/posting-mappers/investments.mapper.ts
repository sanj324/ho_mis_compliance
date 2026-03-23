import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mapInvestmentPosting = async (investmentId: string) => {
  const investment = await prisma.investment.findUnique({ where: { id: investmentId } });
  if (!investment) {
    return null;
  }

  return {
    moduleName: "INVESTMENTS" as const,
    eventCode: "INVESTMENT_PURCHASE",
    referenceType: "Investment",
    referenceId: investment.id,
    branchId: investment.branchId,
    postingDate: new Date(),
    amount: Number(investment.bookValue),
    narration: `Investment posting for ${investment.investmentCode}`
  };
};
