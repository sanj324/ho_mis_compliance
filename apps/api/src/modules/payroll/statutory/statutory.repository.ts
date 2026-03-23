import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class StatutoryRepository {
  findCurrent(branchId?: string, effectiveDate = new Date()) {
    return prisma.statutorySetup.findFirst({
      where: {
        ...(branchId ? { OR: [{ branchId }, { branchId: null }] } : {}),
        effectiveFrom: {
          lte: effectiveDate
        }
      },
      orderBy: [{ branchId: "desc" }, { effectiveFrom: "desc" }]
    });
  }

  create(data: Prisma.StatutorySetupCreateInput) {
    return prisma.statutorySetup.create({ data });
  }
}

export const statutoryRepository = new StatutoryRepository();
