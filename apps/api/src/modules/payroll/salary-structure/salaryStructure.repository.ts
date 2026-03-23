import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class SalaryStructureRepository {
  findMany(branchId?: string) {
    return prisma.salaryStructure.findMany({
      ...(branchId ? { where: { employee: { branchId } } } : {}),
      include: {
        employee: true
      },
      orderBy: {
        effectiveFrom: "desc"
      }
    });
  }

  create(data: Prisma.SalaryStructureCreateInput) {
    return prisma.salaryStructure.create({
      data,
      include: {
        employee: true
      }
    });
  }

  findActiveByEmployee(employeeId: string, effectiveDate: Date) {
    return prisma.salaryStructure.findFirst({
      where: {
        employeeId,
        effectiveFrom: {
          lte: effectiveDate
        },
        isActive: true
      },
      orderBy: {
        effectiveFrom: "desc"
      }
    });
  }
}

export const salaryStructureRepository = new SalaryStructureRepository();
