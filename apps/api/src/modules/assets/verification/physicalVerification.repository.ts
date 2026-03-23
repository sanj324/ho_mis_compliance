import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class PhysicalVerificationRepository {
  findMany() {
    return prisma.assetVerification.findMany({
      include: { asset: true },
      orderBy: { verificationDate: "desc" }
    });
  }

  create(data: Prisma.AssetVerificationCreateInput) {
    return prisma.assetVerification.create({
      data,
      include: { asset: true }
    });
  }
}

export const physicalVerificationRepository = new PhysicalVerificationRepository();
