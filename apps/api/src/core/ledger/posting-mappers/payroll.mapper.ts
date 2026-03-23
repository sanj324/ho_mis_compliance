import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mapPayrollPosting = async (runId: string) => {
  const run = await prisma.payrollRun.findUnique({ where: { id: runId } });
  if (!run) {
    return null;
  }

  return {
    moduleName: "PAYROLL" as const,
    eventCode: "PAYROLL_RUN_FINALIZED",
    referenceType: "PayrollRun",
    referenceId: run.id,
    branchId: run.branchId,
    postingDate: new Date(),
    amount: Number(run.totalNet),
    narration: `Payroll posting for run ${run.runCode}`
  };
};
