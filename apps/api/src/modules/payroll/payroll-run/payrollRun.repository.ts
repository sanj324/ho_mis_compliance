import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class PayrollRunRepository {
  findRuns(filters: { branchId?: string; month?: number; year?: number }) {
    return prisma.payrollRun.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.month && filters.year
          ? {
              payrollMonth: {
                month: filters.month,
                year: filters.year
              }
            }
          : {})
      },
      include: {
        payrollMonth: true,
        items: true,
        exceptions: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  findById(id: string) {
    return prisma.payrollRun.findUnique({
      where: { id },
      include: {
        payrollMonth: true,
        items: {
          include: {
            employee: true
          }
        },
        exceptions: {
          include: {
            employee: true
          }
        },
        branch: true
      }
    });
  }

  findPayrollMonth(branchId: string, month: number, year: number) {
    return prisma.payrollMonth.findUnique({
      where: {
        branchId_month_year: {
          branchId,
          month,
          year
        }
      }
    });
  }

  createPayrollMonth(data: Prisma.PayrollMonthCreateInput) {
    return prisma.payrollMonth.create({ data });
  }

  createRun(data: Prisma.PayrollRunCreateInput) {
    return prisma.payrollRun.create({
      data,
      include: {
        payrollMonth: true,
        items: true,
        exceptions: true
      }
    });
  }

  replaceCalculatedRun(
    existingRunId: string,
    payload: {
      totalGross: number;
      totalDeductions: number;
      totalNet: number;
      items: Array<{
        employeeId: string;
        grossPay: number;
        pfDeduction: number;
        esiDeduction: number;
        ptDeduction: number;
        tdsDeduction: number;
        totalDeductions: number;
        netPay: number;
        exceptionCount: number;
      }>;
      exceptions: Array<{
        employeeId?: string;
        exceptionCode: string;
        exceptionMessage: string;
        severity: string;
      }>;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.payrollRunItem.deleteMany({ where: { payrollRunId: existingRunId } });
      await tx.payrollException.deleteMany({ where: { payrollRunId: existingRunId } });

      return tx.payrollRun.update({
        where: { id: existingRunId },
        data: {
          totalGross: payload.totalGross,
          totalDeductions: payload.totalDeductions,
          totalNet: payload.totalNet,
          status: "CALCULATED",
          approvalState: "PENDING_APPROVAL",
          items: {
            create: payload.items
          },
          exceptions: {
            create: payload.exceptions
          }
        },
        include: {
          payrollMonth: true,
          items: true,
          exceptions: true
        }
      });
    });
  }
}

export const payrollRunRepository = new PayrollRunRepository();
