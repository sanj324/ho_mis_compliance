import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { auditService } from "../../../core/audit/audit.service.js";
import { employeeRepository } from "./employee.repository.js";
import type { EmployeeCreateInput, EmployeeListFilters } from "./employee.types.js";

const deriveKycStatus = (input: {
  panNo: string | undefined;
  aadhaarNo: string | undefined;
  bankAccountNo: string | undefined;
  ifscCode: string | undefined;
  kycStatus: string | undefined;
}): string =>
  input.kycStatus ??
  (input.panNo && input.aadhaarNo && input.bankAccountNo && input.ifscCode ? "COMPLETED" : "PENDING");

export class EmployeeService {
  list(filters: EmployeeListFilters) {
    return employeeRepository.findMany(filters);
  }

  async getById(id: string) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
    }

    return employee;
  }

  async create(
    input: EmployeeCreateInput,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const kycStatus = deriveKycStatus({
      panNo: input.panNo,
      aadhaarNo: input.aadhaarNo,
      bankAccountNo: input.bankAccountNo,
      ifscCode: input.ifscCode,
      kycStatus: input.kycStatus
    });
    const employee = await employeeRepository.create(
      {
        employeeCode: input.employeeCode,
        fullName: input.fullName,
        joiningDate: new Date(input.joiningDate),
        ...(input.dob ? { dob: new Date(input.dob) } : {}),
        branch: { connect: { id: input.branchId } },
        ...(input.departmentId ? { department: { connect: { id: input.departmentId } } } : {}),
        ...(input.designationId ? { designation: { connect: { id: input.designationId } } } : {}),
        ...(input.costCenterId ? { costCenter: { connect: { id: input.costCenterId } } } : {}),
        ...(input.panNo ? { panNo: input.panNo } : {}),
        ...(input.aadhaarNo ? { aadhaarNo: input.aadhaarNo } : {}),
        ...(input.uanNo ? { uanNo: input.uanNo } : {}),
        ...(input.esiNo ? { esiNo: input.esiNo } : {}),
        ...(input.bankAccountNo ? { bankAccountNo: input.bankAccountNo } : {}),
        ...(input.ifscCode ? { ifscCode: input.ifscCode } : {}),
        ...(input.activeStatus !== undefined ? { activeStatus: input.activeStatus } : {}),
        kycStatus,
        approvalState: "PENDING_APPROVAL"
      },
      {
        panVerified: Boolean(input.panNo),
        aadhaarVerified: Boolean(input.aadhaarNo),
        bankVerified: Boolean(input.bankAccountNo && input.ifscCode)
      }
    );

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "Employee",
      entityId: employee.id,
      action: AuditActionEnum.CREATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: employee.branchId,
      newValues: employee
    });

    return employee;
  }

  async update(
    id: string,
    input: Partial<EmployeeCreateInput>,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existing = await this.getById(id);
    const kycStatus = deriveKycStatus({
      panNo: input.panNo ?? existing.panNo ?? undefined,
      aadhaarNo: input.aadhaarNo ?? existing.aadhaarNo ?? undefined,
      bankAccountNo: input.bankAccountNo ?? existing.bankAccountNo ?? undefined,
      ifscCode: input.ifscCode ?? existing.ifscCode ?? undefined,
      kycStatus: input.kycStatus
    });

    const employee = await employeeRepository.update(
      id,
      {
        ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
        ...(input.joiningDate ? { joiningDate: new Date(input.joiningDate) } : {}),
        ...(input.dob ? { dob: new Date(input.dob) } : {}),
        ...(input.departmentId !== undefined
          ? input.departmentId
            ? { department: { connect: { id: input.departmentId } } }
            : { department: { disconnect: true } }
          : {}),
        ...(input.designationId !== undefined
          ? input.designationId
            ? { designation: { connect: { id: input.designationId } } }
            : { designation: { disconnect: true } }
          : {}),
        ...(input.costCenterId !== undefined
          ? input.costCenterId
            ? { costCenter: { connect: { id: input.costCenterId } } }
            : { costCenter: { disconnect: true } }
          : {}),
        ...(input.panNo !== undefined ? { panNo: input.panNo } : {}),
        ...(input.aadhaarNo !== undefined ? { aadhaarNo: input.aadhaarNo } : {}),
        ...(input.uanNo !== undefined ? { uanNo: input.uanNo } : {}),
        ...(input.esiNo !== undefined ? { esiNo: input.esiNo } : {}),
        ...(input.bankAccountNo !== undefined ? { bankAccountNo: input.bankAccountNo } : {}),
        ...(input.ifscCode !== undefined ? { ifscCode: input.ifscCode } : {}),
        ...(input.activeStatus !== undefined ? { activeStatus: input.activeStatus } : {}),
        kycStatus,
        approvalState: "PENDING_APPROVAL"
      },
      {
        update: {
          panVerified: Boolean(input.panNo ?? existing.panNo),
          aadhaarVerified: Boolean(input.aadhaarNo ?? existing.aadhaarNo),
          bankVerified: Boolean((input.bankAccountNo ?? existing.bankAccountNo) && (input.ifscCode ?? existing.ifscCode))
        },
        create: {
          panVerified: Boolean(input.panNo ?? existing.panNo),
          aadhaarVerified: Boolean(input.aadhaarNo ?? existing.aadhaarNo),
          bankVerified: Boolean((input.bankAccountNo ?? existing.bankAccountNo) && (input.ifscCode ?? existing.ifscCode))
        }
      }
    );

    await auditService.record({
      moduleName: "PAYROLL",
      entityName: "Employee",
      entityId: employee.id,
      action: AuditActionEnum.UPDATE,
      requestId: context.requestId,
      userId: context.userId,
      branchId: employee.branchId,
      oldValues: existing,
      newValues: employee
    });

    return employee;
  }
}

export const employeeService = new EmployeeService();
