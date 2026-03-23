import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class StockRepository {
  createLedgerEntry(data: Prisma.StockLedgerCreateInput) {
    return prisma.stockLedger.create({ data });
  }

  findLedger(branchId?: string) {
    return branchId
      ? prisma.stockLedger.findMany({
          where: { branchId },
          include: { item: true, branch: true },
          orderBy: { transactionDate: "desc" }
        })
      : prisma.stockLedger.findMany({
          include: { item: true, branch: true },
          orderBy: { transactionDate: "desc" }
        });
  }
}

export const stockRepository = new StockRepository();
