import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class CostCenterRepository {
  findMany(branchId?: string) {
    return prisma.costCenter.findMany({
      ...(branchId ? { where: { branchId } } : {}),
      include: {
        branch: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }

  findById(id: string) {
    return prisma.costCenter.findUnique({
      where: { id },
      include: {
        branch: true,
        _count: {
          select: {
            employees: true,
            assets: true
          }
        }
      }
    });
  }

  create(data: Prisma.CostCenterCreateInput) {
    return prisma.costCenter.create({
      data,
      include: {
        branch: true
      }
    });
  }

  update(id: string, data: Prisma.CostCenterUpdateInput) {
    return prisma.costCenter.update({
      where: { id },
      data,
      include: {
        branch: true
      }
    });
  }

  delete(id: string) {
    return prisma.costCenter.delete({
      where: { id }
    });
  }
}

export const costCenterRepository = new CostCenterRepository();
