import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class CounterpartyRepository {
  findMany() {
    return prisma.counterparty.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  create(data: Prisma.CounterpartyCreateInput) {
    return prisma.counterparty.create({ data });
  }
}

export const counterpartyRepository = new CounterpartyRepository();
