import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class VendorRepository {
  findMany() {
    return prisma.vendor.findMany({ orderBy: { name: "asc" } });
  }

  create(data: Prisma.VendorCreateInput) {
    return prisma.vendor.create({ data });
  }
}

export const vendorRepository = new VendorRepository();
