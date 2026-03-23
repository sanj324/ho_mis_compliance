import { z } from "zod";

export const employeeQuerySchema = z.object({
  branchId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  activeStatus: z.coerce.boolean().optional()
});

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(2).max(30),
  fullName: z.string().min(3).max(150),
  dob: z.string().datetime().optional(),
  joiningDate: z.string().datetime(),
  branchId: z.string().uuid(),
  departmentId: z.string().uuid().optional(),
  designationId: z.string().uuid().optional(),
  costCenterId: z.string().uuid().optional(),
  panNo: z.string().max(20).optional(),
  aadhaarNo: z.string().max(20).optional(),
  uanNo: z.string().max(20).optional(),
  esiNo: z.string().max(20).optional(),
  bankAccountNo: z.string().max(40).optional(),
  ifscCode: z.string().max(20).optional(),
  activeStatus: z.boolean().optional(),
  kycStatus: z.string().max(30).optional()
});

export const updateEmployeeSchema = createEmployeeSchema.partial().omit({
  employeeCode: true
});
