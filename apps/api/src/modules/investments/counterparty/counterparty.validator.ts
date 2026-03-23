import { z } from "zod";

export const createCounterpartySchema = z.object({
  code: z.string().min(2).max(30),
  name: z.string().min(3).max(120),
  exposureLimit: z.number().nonnegative().optional(),
  isActive: z.boolean().optional()
});
