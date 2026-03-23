import { z } from "zod";

export const payrollRunFilterSchema = z.object({
  branchId: z.string().uuid().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional()
});

export const calculatePayrollSchema = z.object({
  branchId: z.string().uuid(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100)
});

export const finalizePayrollSchema = z.object({
  payrollRunId: z.string().uuid()
});
