import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class DepartmentRepository {
  findMany(branchId?: string) {
    return prisma.department.findMany({
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
    return prisma.department.findUnique({
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

  create(data: Prisma.DepartmentCreateInput) {
    return prisma.department.create({
      data,
      include: {
        branch: true
      }
    });
  }

  update(id: string, data: Prisma.DepartmentUpdateInput) {
    return prisma.department.update({
      where: { id },
      data,
      include: {
        branch: true
      }
    });
  }

  delete(id: string) {
    return prisma.department.delete({
      where: { id }
    });
  }
}

export const departmentRepository = new DepartmentRepository();
