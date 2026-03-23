import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DepreciationMethodRepository {
  findMany() {
    return prisma.depreciationMethod.findMany({ orderBy: { name: "asc" } });
  }

  create(data: Prisma.DepreciationMethodCreateInput) {
    return prisma.depreciationMethod.create({ data });
  }
}

export const depreciationMethodRepository = new DepreciationMethodRepository();
