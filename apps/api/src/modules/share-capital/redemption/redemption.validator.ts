import { z } from "zod";

export const createRedemptionSchema = z.object({
  memberId: z.string().uuid(),
  shareClassId: z.string().uuid(),
  redemptionDate: z.string().datetime(),
  noOfShares: z.coerce.number().int().positive(),
  redemptionValue: z.coerce.number().positive(),
  remarks: z.string().trim().max(500).optional()
});
