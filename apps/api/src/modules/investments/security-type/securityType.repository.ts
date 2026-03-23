import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class SecurityTypeRepository {
  findMany() {
    return prisma.securityType.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  create(data: Prisma.SecurityTypeCreateInput) {
    return prisma.securityType.create({ data });
  }
}

export const securityTypeRepository = new SecurityTypeRepository();
