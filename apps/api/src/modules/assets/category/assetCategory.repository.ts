import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetCategoryRepository {
  findMany() {
    return prisma.assetCategory.findMany({ orderBy: { name: "asc" } });
  }

  create(data: Prisma.AssetCategoryCreateInput) {
    return prisma.assetCategory.create({ data });
  }
}

export const assetCategoryRepository = new AssetCategoryRepository();
