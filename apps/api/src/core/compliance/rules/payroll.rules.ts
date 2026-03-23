import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const evaluatePayrollRules = async () => {
  const employees = await prisma.employee.findMany({
    where: {
      OR: [{ kycStatus: { not: "COMPLETED" } }, { panNo: null }, { aadhaarNo: null }]
    }
  });

  return employees.map((employee) => ({
    moduleName: "PAYROLL" as const,
    entityType: "Employee",
    entityId: employee.id,
    ruleCode: "PAYROLL_KYC_DEFICIENT",
    ruleDescription: "Employee master has incomplete KYC or statutory identifiers",
    severity: "HIGH",
    branchId: employee.branchId,
    dueDate: null
  }));
};
