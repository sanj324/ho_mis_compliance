import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class BrokerRepository {
  findMany() {
    return prisma.broker.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  create(data: Prisma.BrokerCreateInput) {
    return prisma.broker.create({ data });
  }
}

export const brokerRepository = new BrokerRepository();
