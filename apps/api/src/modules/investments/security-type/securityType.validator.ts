import { z } from "zod";

export const createSecurityTypeSchema = z.object({
  code: z.string().min(2).max(30),
  name: z.string().min(3).max(120),
  category: z.string().min(2).max(50),
  slrEligible: z.boolean().optional()
});
