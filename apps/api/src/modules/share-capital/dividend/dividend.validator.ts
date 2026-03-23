import { z } from "zod";

export const declareDividendSchema = z.object({
  shareClassId: z.string().uuid(),
  declarationDate: z.string().datetime(),
  dividendRate: z.coerce.number().min(0).max(100),
  remarks: z.string().trim().max(500).optional()
});
