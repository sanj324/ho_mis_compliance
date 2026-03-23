import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DesignationRepository {
  findMany(branchId?: string) {
    return prisma.designation.findMany({
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
    return prisma.designation.findUnique({
      where: { id },
      include: {
        branch: true,
        _count: {
          select: {
            employees: true
          }
        }
      }
    });
  }

  create(data: Prisma.DesignationCreateInput) {
    return prisma.designation.create({
      data,
      include: {
        branch: true
      }
    });
  }

  update(id: string, data: Prisma.DesignationUpdateInput) {
    return prisma.designation.update({
      where: { id },
      data,
      include: {
        branch: true
      }
    });
  }

  delete(id: string) {
    return prisma.designation.delete({
      where: { id }
    });
  }
}

export const designationRepository = new DesignationRepository();
