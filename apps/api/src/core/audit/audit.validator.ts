import { z } from "zod";

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});
