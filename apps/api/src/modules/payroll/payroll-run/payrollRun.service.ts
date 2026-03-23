import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { PayrollRunStatusEnum } from "../../../common/enums/payroll.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { payrollCalculationService } from "./payrollCalculation.service.js";
import { payrollRunRepository } from "./payrollRun.repository.js";

const prisma = new PrismaClient();

const buildRunCode = (branchId: string, month: number, year: number): string =>
  `PR-${branchId.slice(0, 4).toUpperCase()}-${year}${String(month).padStart(2, "0")}`;

export class PayrollRunService {
  list(filters: { branchId?: string; month?: number; year?: number }) {
    return payrollRunRepository.findRuns(filters);
  }

  async getById(id: string) {
    const run = await payrollRunRepository.findById(id);
    if (!run) {
      throw new AppError("Payroll run not found", StatusCodes.NOT_FOUND);
    }

    return run;
  }

  async calculate(
    input: { branchId: string; month: number; year: number },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    let payrollMonth = await payrollRunRepository.findPayrollMonth(input.branchId, input.month, input.year);
    if (!payrollMonth) {
      payrollMonth = await payrollRunRepository.createPayrollMonth({
        branch: { connect: { id: input.branchId } },
        month: input.month,
        year: input.year,
        approvalState: "PENDING_APPROVAL"
      });
    }

    if (payrollMonth.isLocked) {
      throw new AppError("Payroll month is locked after finalization", StatusCodes.BAD_REQUEST);
    }

    const calculated = await payrollCalculationService.calculate(input.branchId, input.month, input.year);
    const existingRun = await prisma.payrollRun.findFirst({
      where: {
        branchId: input.branchId,
        payrollMonthId: payrollMonth.id,
        status: PayrollRunStatusEnum.CALCULATED
      }
    });

    const run = existingRun
      ? await payrollRunRepository.replaceCalculatedRun(existingRun.id, calculated)
      : await payrollRunRepository.createRun({
          branch: { connect: { id: input.branchId } },
          payrollMonth: { connect: { id: payrollMonth.id } },
          runCode: buildRunCode(input.branchId, input.month, input.year),
          status: PayrollRunStatusEnum.CALCULATED,
          approvalState: "PENDING_APPROVAL",
          totalGross: calculated.totalGross,
          totalDeductions: calculated.totalDeductions,
          totalNet: calculated.totalNet,
          items: {
            create: calculated.items
          },
          exceptions: {
            create: calculated.exceptions
          }
        });

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "PayrollRun",
      entityId: run.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: input.branchId,
      newValues: {
        totalGross: run.totalGross,
        totalNet: run.totalNet,
        itemCount: run.items.length
      }
    });

    return run;
  }

  async finalize(
    input: { payrollRunId: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existingRun = await this.getById(input.payrollRunId);
    if (existingRun.status === PayrollRunStatusEnum.FINALIZED) {
      throw new AppError("Payroll run already finalized", StatusCodes.BAD_REQUEST);
    }

    const finalized = await prisma.$transaction(async (tx) => {
      const run = await tx.payrollRun.update({
        where: { id: input.payrollRunId },
        data: {
          status: PayrollRunStatusEnum.FINALIZED,
          approvalState: "APPROVED",
          finalizedAt: new Date(),
          ...(context.userId ? { finalizedBy: { connect: { id: context.userId } } } : {})
        },
        include: {
          payrollMonth: true,
          items: true,
          exceptions: true
        }
      });

      await tx.payrollMonth.update({
        where: { id: existingRun.payrollMonthId },
        data: {
          isLocked: true,
          approvalState: "APPROVED"
        }
      });

      return run;
    });

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "PayrollRun",
      entityId: finalized.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: finalized.branchId,
      oldValues: { status: existingRun.status },
      newValues: { status: finalized.status, finalizedAt: finalized.finalizedAt }
    });

    return finalized;
  }
}

export const payrollRunService = new PayrollRunService();
