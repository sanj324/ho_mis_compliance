import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetDisposalRepository {
  findMany() {
    return prisma.assetDisposal.findMany({
      include: { asset: true },
      orderBy: { disposalDate: "desc" }
    });
  }

  create(data: Prisma.AssetDisposalCreateInput) {
    return prisma.assetDisposal.create({
      data,
      include: { asset: true }
    });
  }
}

export const assetDisposalRepository = new AssetDisposalRepository();
