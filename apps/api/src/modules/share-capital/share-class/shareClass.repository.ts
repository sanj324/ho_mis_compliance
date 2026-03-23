import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class ShareClassRepository {
  list() {
    return prisma.shareClass.findMany({
      orderBy: { name: "asc" }
    });
  }

  findById(id: string) {
    return prisma.shareClass.findUnique({ where: { id } });
  }

  create(data: Prisma.ShareClassCreateInput) {
    return prisma.shareClass.create({ data });
  }
}

export const shareClassRepository = new ShareClassRepository();
