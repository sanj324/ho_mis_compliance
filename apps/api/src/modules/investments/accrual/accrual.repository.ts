import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AccrualRepository {
  create(data: Prisma.InvestmentAccrualCreateInput) {
    return prisma.investmentAccrual.create({ data });
  }

  findByInvestment(investmentId: string) {
    return prisma.investmentAccrual.findMany({
      where: { investmentId },
      orderBy: {
        accrualDate: "desc"
      }
    });
  }
}

export const accrualRepository = new AccrualRepository();
