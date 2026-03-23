import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class RedemptionRepository {
  create(data: Prisma.ShareRedemptionCreateInput) {
    return prisma.shareRedemption.create({
      data,
      include: {
        member: true,
        shareClass: true
      }
    });
  }
}

export const redemptionRepository = new RedemptionRepository();
