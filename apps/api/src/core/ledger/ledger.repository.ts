import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LedgerRepository {
  listAccounts() {
    return prisma.ledgerAccount.findMany({
      where: { isActive: true },
      orderBy: { accountCode: "asc" }
    });
  }

  listVouchers() {
    return prisma.voucher.findMany({
      include: {
        lines: true
      },
      orderBy: { postingDate: "desc" }
    });
  }

  findMapping(moduleName: string, eventCode: string) {
    return prisma.moduleLedgerMapping.findFirst({
      where: {
        moduleName: moduleName as never,
        eventCode,
        isActive: true
      }
    });
  }

  createVoucher(data: Parameters<typeof prisma.voucher.create>[0]["data"]) {
    return prisma.voucher.create({
      data,
      include: {
        lines: true
      }
    });
  }
}

export const ledgerRepository = new LedgerRepository();
