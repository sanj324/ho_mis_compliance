import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class ShareTransferRepository {
  create(data: Prisma.ShareTransferCreateInput) {
    return prisma.shareTransfer.create({
      data,
      include: {
        fromMember: true,
        toMember: true,
        shareClass: true
      }
    });
  }
}

export const shareTransferRepository = new ShareTransferRepository();
