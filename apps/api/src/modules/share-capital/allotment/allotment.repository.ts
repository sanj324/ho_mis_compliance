import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AllotmentRepository {
  create(data: Prisma.ShareAllotmentCreateInput) {
    return prisma.shareAllotment.create({
      data,
      include: {
        member: true,
        shareClass: true
      }
    });
  }
}

export const allotmentRepository = new AllotmentRepository();
