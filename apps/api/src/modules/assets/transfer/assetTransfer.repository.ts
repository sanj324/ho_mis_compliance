import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetTransferRepository {
  findMany() {
    return prisma.assetTransfer.findMany({
      include: {
        asset: true,
        fromBranch: true,
        toBranch: true
      },
      orderBy: { transferDate: "desc" }
    });
  }

  create(data: Prisma.AssetTransferCreateInput) {
    return prisma.assetTransfer.create({
      data,
      include: {
        asset: true,
        fromBranch: true,
        toBranch: true
      }
    });
  }
}

export const assetTransferRepository = new AssetTransferRepository();
