import { z } from "zod";

export const createLeaveSchema = z.object({
  employeeId: z.string().uuid(),
  leaveType: z.string().min(2).max(40),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalDays: z.number().positive(),
  remarks: z.string().max(255).optional()
});
