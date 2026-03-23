import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class ItemRepository {
  findMany() {
    return prisma.stationeryItem.findMany({
      include: { itemCategory: true },
      orderBy: { itemName: "asc" }
    });
  }

  findById(id: string) {
    return prisma.stationeryItem.findUnique({
      where: { id },
      include: { itemCategory: true }
    });
  }

  create(data: Prisma.StationeryItemCreateInput) {
    return prisma.stationeryItem.create({
      data,
      include: { itemCategory: true }
    });
  }

  createException(data: Prisma.StationeryExceptionCreateInput) {
    return prisma.stationeryException.create({ data });
  }
}

export const itemRepository = new ItemRepository();
