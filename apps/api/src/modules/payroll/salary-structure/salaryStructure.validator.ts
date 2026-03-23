import { z } from "zod";

export const createSalaryStructureSchema = z.object({
  employeeId: z.string().uuid(),
  effectiveFrom: z.string().datetime(),
  basicPay: z.number().nonnegative(),
  hra: z.number().nonnegative().optional(),
  specialAllowance: z.number().nonnegative().optional(),
  conveyanceAllowance: z.number().nonnegative().optional(),
  otherAllowance: z.number().nonnegative().optional()
});
