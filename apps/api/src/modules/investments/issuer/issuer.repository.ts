import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class IssuerRepository {
  findMany() {
    return prisma.issuer.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  create(data: Prisma.IssuerCreateInput) {
    return prisma.issuer.create({ data });
  }
}

export const issuerRepository = new IssuerRepository();
