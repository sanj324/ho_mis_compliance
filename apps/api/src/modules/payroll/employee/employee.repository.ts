import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class EmployeeRepository {
  findMany(filters: { branchId?: string; departmentId?: string; activeStatus?: boolean }) {
    return prisma.employee.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
        ...(filters.activeStatus !== undefined ? { activeStatus: filters.activeStatus } : {})
      },
      include: {
        branch: true,
        department: true,
        designation: true,
        costCenter: true,
        employeeKyc: true
      },
      orderBy: {
        employeeCode: "asc"
      }
    });
  }

  findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        branch: true,
        department: true,
        designation: true,
        costCenter: true,
        employeeKyc: true
      }
    });
  }

  create(data: Prisma.EmployeeCreateInput, kycData?: Prisma.EmployeeKycCreateWithoutEmployeeInput) {
    return prisma.employee.create({
      data: {
        ...data,
        ...(kycData ? { employeeKyc: { create: kycData } } : {})
      },
      include: {
        branch: true,
        department: true,
        designation: true,
        costCenter: true,
        employeeKyc: true
      }
    });
  }

  update(id: string, data: Prisma.EmployeeUpdateInput, kycData?: Prisma.EmployeeKycUpsertWithoutEmployeeInput) {
    return prisma.employee.update({
      where: { id },
      data: {
        ...data,
        ...(kycData ? { employeeKyc: { upsert: kycData } } : {})
      },
      include: {
        branch: true,
        department: true,
        designation: true,
        costCenter: true,
        employeeKyc: true
      }
    });
  }
}

export const employeeRepository = new EmployeeRepository();
