import { PrismaClient } from "@prisma/client";

import { PayrollExceptionSeverityEnum } from "../../../common/enums/payroll.enum.js";
import { salaryStructureRepository } from "../salary-structure/salaryStructure.repository.js";
import { statutoryRepository } from "../statutory/statutory.repository.js";

const prisma = new PrismaClient();

export class PayrollCalculationService {
  async calculate(branchId: string, month: number, year: number) {
    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const [employees, attendance, statutory] = await Promise.all([
      prisma.employee.findMany({
        where: {
          branchId,
          activeStatus: true
        }
      }),
      prisma.attendanceRecord.findMany({
        where: {
          branchId,
          attendanceDate: {
            gte: fromDate,
            lt: toDate
          }
        }
      }),
      statutoryRepository.findCurrent(branchId, toDate)
    ]);

    const statutoryValues = statutory ?? {
      pfRateEmployee: 12,
      esiRateEmployee: 0.75,
      professionalTax: 200,
      tdsRate: 10
    };

    const items: Array<{
      employeeId: string;
      grossPay: number;
      pfDeduction: number;
      esiDeduction: number;
      ptDeduction: number;
      tdsDeduction: number;
      totalDeductions: number;
      netPay: number;
      exceptionCount: number;
    }> = [];

    const exceptions: Array<{
      employeeId?: string;
      exceptionCode: string;
      exceptionMessage: string;
      severity: string;
    }> = [];

    for (const employee of employees) {
      const structure = await salaryStructureRepository.findActiveByEmployee(employee.id, toDate);
      if (!structure) {
        exceptions.push({
          employeeId: employee.id,
          exceptionCode: "SALARY_STRUCTURE_MISSING",
          exceptionMessage: `Salary structure missing for ${employee.fullName}`,
          severity: PayrollExceptionSeverityEnum.HIGH
        });
        continue;
      }

      const employeeAttendance = attendance.filter((record) => record.employeeId === employee.id);
      const attendanceUnits = employeeAttendance.reduce((sum, record) => sum + Number(record.attendanceUnits), 0);
      const payableUnits = attendanceUnits || daysInMonth;

      const baseGross =
        Number(structure.basicPay) +
        Number(structure.hra) +
        Number(structure.specialAllowance) +
        Number(structure.conveyanceAllowance) +
        Number(structure.otherAllowance);

      const grossPay = Number(((baseGross / daysInMonth) * payableUnits).toFixed(2));
      const pfDeduction = employee.uanNo
        ? Number(((Number(structure.basicPay) * Number(statutoryValues.pfRateEmployee)) / 100).toFixed(2))
        : 0;
      const esiDeduction =
        employee.esiNo && grossPay <= 21000
          ? Number(((grossPay * Number(statutoryValues.esiRateEmployee)) / 100).toFixed(2))
          : 0;
      const ptDeduction = grossPay >= 15000 ? Number(statutoryValues.professionalTax) : 0;
      const tdsDeduction = employee.panNo
        ? Number(((grossPay * Number(statutoryValues.tdsRate)) / 100).toFixed(2))
        : 0;
      const totalDeductions = Number((pfDeduction + esiDeduction + ptDeduction + tdsDeduction).toFixed(2));
      const netPay = Number((grossPay - totalDeductions).toFixed(2));

      let exceptionCount = 0;
      if (!employee.panNo) {
        exceptionCount += 1;
        exceptions.push({
          employeeId: employee.id,
          exceptionCode: "PAN_MISSING",
          exceptionMessage: `PAN missing for ${employee.fullName}`,
          severity: PayrollExceptionSeverityEnum.HIGH
        });
      }
      if (!employee.aadhaarNo) {
        exceptionCount += 1;
        exceptions.push({
          employeeId: employee.id,
          exceptionCode: "AADHAAR_MISSING",
          exceptionMessage: `Aadhaar missing for ${employee.fullName}`,
          severity: PayrollExceptionSeverityEnum.HIGH
        });
      }
      if (!employee.bankAccountNo || !employee.ifscCode) {
        exceptionCount += 1;
        exceptions.push({
          employeeId: employee.id,
          exceptionCode: "BANK_DETAILS_INCOMPLETE",
          exceptionMessage: `Bank details incomplete for ${employee.fullName}`,
          severity: PayrollExceptionSeverityEnum.MEDIUM
        });
      }
      if (employee.kycStatus !== "COMPLETED") {
        exceptionCount += 1;
        exceptions.push({
          employeeId: employee.id,
          exceptionCode: "KYC_INCOMPLETE",
          exceptionMessage: `KYC incomplete for ${employee.fullName}`,
          severity: PayrollExceptionSeverityEnum.HIGH
        });
      }

      items.push({
        employeeId: employee.id,
        grossPay,
        pfDeduction,
        esiDeduction,
        ptDeduction,
        tdsDeduction,
        totalDeductions,
        netPay,
        exceptionCount
      });
    }

    return {
      items,
      exceptions,
      totalGross: Number(items.reduce((sum, item) => sum + item.grossPay, 0).toFixed(2)),
      totalDeductions: Number(items.reduce((sum, item) => sum + item.totalDeductions, 0).toFixed(2)),
      totalNet: Number(items.reduce((sum, item) => sum + item.netPay, 0).toFixed(2))
    };
  }
}

export const payrollCalculationService = new PayrollCalculationService();
