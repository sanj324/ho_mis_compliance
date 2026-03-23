import { z } from "zod";

export const createShareClassSchema = z.object({
  code: z.string().trim().min(1).max(50),
  name: z.string().trim().min(2).max(150),
  faceValue: z.coerce.number().positive(),
  dividendRate: z.coerce.number().min(0).max(100).optional(),
  isActive: z.boolean().optional()
});
