import { z } from "zod";

export const attendanceQuerySchema = z.object({
  branchId: z.string().uuid().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional()
});

export const bulkAttendanceSchema = z.object({
  records: z.array(
    z.object({
      employeeId: z.string().uuid(),
      branchId: z.string().uuid(),
      attendanceDate: z.string().datetime(),
      status: z.enum(["PRESENT", "ABSENT", "HALF_DAY", "WEEK_OFF", "HOLIDAY", "PAID_LEAVE"]),
      attendanceUnits: z.number().min(0).max(1).optional()
    })
  ).min(1)
});
