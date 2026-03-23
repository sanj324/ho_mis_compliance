import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetRepository {
  findMany(filters: { branchId?: string; status?: string; categoryId?: string }) {
    return prisma.asset.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.status ? { currentStatus: filters.status } : {}),
        ...(filters.categoryId ? { assetCategoryId: filters.categoryId } : {})
      },
      include: {
        branch: true,
        assetCategory: true,
        depreciationMethod: true,
        insurances: true,
        transfers: true,
        disposals: true
      },
      orderBy: { capitalizationDate: "desc" }
    });
  }

  findById(id: string) {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        branch: true,
        assetCategory: true,
        depreciationMethod: true,
        insurances: true,
        depreciationRuns: true,
        transfers: true,
        disposals: true,
        verifications: true,
        exceptions: true
      }
    });
  }

  create(data: Prisma.AssetCreateInput) {
    return prisma.asset.create({
      data,
      include: {
        branch: true,
        assetCategory: true,
        depreciationMethod: true,
        insurances: true
      }
    });
  }

  update(id: string, data: Prisma.AssetUpdateInput) {
    return prisma.asset.update({
      where: { id },
      data,
      include: {
        branch: true,
        assetCategory: true,
        depreciationMethod: true,
        insurances: true,
        transfers: true,
        disposals: true
      }
    });
  }

  createException(data: Prisma.AssetExceptionCreateInput) {
    return prisma.assetException.create({ data });
  }
}

export const assetRepository = new AssetRepository();
