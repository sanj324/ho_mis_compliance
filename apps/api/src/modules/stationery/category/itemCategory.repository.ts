import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class ItemCategoryRepository {
  findMany() {
    return prisma.itemCategory.findMany({ orderBy: { name: "asc" } });
  }

  create(data: Prisma.ItemCategoryCreateInput) {
    return prisma.itemCategory.create({ data });
  }
}

export const itemCategoryRepository = new ItemCategoryRepository();
