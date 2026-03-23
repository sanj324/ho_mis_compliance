import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DepreciationRepository {
  createRun(data: Prisma.AssetDepreciationRunCreateInput) {
    return prisma.assetDepreciationRun.create({ data });
  }

  findRuns(assetId?: string) {
    return assetId
      ? prisma.assetDepreciationRun.findMany({
          where: { assetId },
          include: { asset: true },
          orderBy: [{ runYear: "desc" }, { runMonth: "desc" }]
        })
      : prisma.assetDepreciationRun.findMany({
          include: { asset: true },
          orderBy: [{ runYear: "desc" }, { runMonth: "desc" }]
        });
  }
}

export const depreciationRepository = new DepreciationRepository();
