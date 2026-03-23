import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class StockTransferRepository {
  findMany() {
    return prisma.stockTransfer.findMany({
      include: {
        item: true,
        fromBranch: true,
        toBranch: true
      },
      orderBy: { transferDate: "desc" }
    });
  }

  create(data: Prisma.StockTransferCreateInput) {
    return prisma.stockTransfer.create({
      data,
      include: {
        item: true,
        fromBranch: true,
        toBranch: true
      }
    });
  }
}

export const stockTransferRepository = new StockTransferRepository();
