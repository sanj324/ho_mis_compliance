import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PayrollDashboardService {
  async summary(branchId?: string) {
    const [employeeCount, activeEmployeeCount, pendingPayrollCount, latestRun, exceptionCount] =
      await Promise.all([
        branchId ? prisma.employee.count({ where: { branchId } }) : prisma.employee.count(),
        prisma.employee.count({ where: { ...(branchId ? { branchId } : {}), activeStatus: true } }),
        prisma.payrollRun.count({ where: { ...(branchId ? { branchId } : {}), status: "CALCULATED" } }),
        prisma.payrollRun.findFirst({
          ...(branchId ? { where: { branchId } } : {}),
          orderBy: { createdAt: "desc" }
        }),
        branchId
          ? prisma.payrollException.count({ where: { payrollRun: { branchId } } })
          : prisma.payrollException.count()
      ]);

    return {
      employeeCount,
      activeEmployeeCount,
      pendingPayrollCount,
      latestRunCode: latestRun?.runCode ?? null,
      latestRunNetAmount: latestRun ? Number(latestRun.totalNet) : 0,
      exceptionCount
    };
  }
}

export const payrollDashboardService = new PayrollDashboardService();
