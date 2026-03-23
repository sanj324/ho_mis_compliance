import { z } from "zod";

export const createShareTransferSchema = z.object({
  fromMemberId: z.string().uuid(),
  toMemberId: z.string().uuid(),
  shareClassId: z.string().uuid(),
  transferDate: z.string().datetime(),
  noOfShares: z.coerce.number().int().positive(),
  remarks: z.string().trim().max(500).optional()
});
