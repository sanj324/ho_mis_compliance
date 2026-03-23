import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class RequisitionRepository {
  create(data: Prisma.RequisitionCreateInput) {
    return prisma.requisition.create({
      data,
      include: {
        branch: true,
        vendor: true,
        items: { include: { item: true } }
      }
    });
  }
}

export const requisitionRepository = new RequisitionRepository();
