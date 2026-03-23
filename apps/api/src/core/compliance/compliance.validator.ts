import { z } from "zod";

export const closeComplianceEventSchema = z.object({
  remarks: z.string().trim().min(2).max(500)
});
