import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PayrollReportService {
  async salaryRegister(filters: { branchId?: string; month?: number; year?: number }) {
    const runs = await prisma.payrollRun.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.month && filters.year ? { payrollMonth: { month: filters.month, year: filters.year } } : {})
      },
      include: {
        payrollMonth: true,
        items: { include: { employee: true } }
      }
    });

    return runs.flatMap((run) =>
      run.items.map((item) => ({
        runCode: run.runCode,
        month: run.payrollMonth.month,
        year: run.payrollMonth.year,
        employeeCode: item.employee.employeeCode,
        employeeName: item.employee.fullName,
        grossPay: Number(item.grossPay),
        totalDeductions: Number(item.totalDeductions),
        netPay: Number(item.netPay)
      }))
    );
  }

  async statutoryDeductions(filters: { branchId?: string; month?: number; year?: number }) {
    const runs = await prisma.payrollRun.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.month && filters.year ? { payrollMonth: { month: filters.month, year: filters.year } } : {})
      },
      include: {
        items: { include: { employee: true } }
      }
    });

    return runs.flatMap((run) =>
      run.items.map((item) => ({
        runCode: run.runCode,
        employeeCode: item.employee.employeeCode,
        employeeName: item.employee.fullName,
        pfDeduction: Number(item.pfDeduction),
        esiDeduction: Number(item.esiDeduction),
        ptDeduction: Number(item.ptDeduction),
        tdsDeduction: Number(item.tdsDeduction)
      }))
    );
  }

  employeeExceptions(filters: { branchId?: string; month?: number; year?: number }) {
    return prisma.payrollException.findMany({
      where: {
        ...(filters.branchId ? { payrollRun: { branchId: filters.branchId } } : {}),
        ...(filters.month && filters.year
          ? { payrollRun: { payrollMonth: { month: filters.month, year: filters.year } } }
          : {})
      },
      include: {
        employee: true,
        payrollRun: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}

export const payrollReportService = new PayrollReportService();
