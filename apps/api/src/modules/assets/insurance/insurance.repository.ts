import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class InsuranceRepository {
  findMany() {
    return prisma.assetInsurance.findMany({
      include: { asset: true },
      orderBy: { expiryDate: "asc" }
    });
  }

  create(data: Prisma.AssetInsuranceCreateInput) {
    return prisma.assetInsurance.create({
      data,
      include: { asset: true }
    });
  }
}

export const insuranceRepository = new InsuranceRepository();
