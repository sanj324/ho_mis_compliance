import { z } from "zod";

export const createAllotmentSchema = z.object({
  memberId: z.string().uuid(),
  shareClassId: z.string().uuid(),
  allotmentDate: z.string().datetime(),
  noOfShares: z.coerce.number().int().positive(),
  paidUpValue: z.coerce.number().positive(),
  shareCertificateNo: z.string().trim().max(100).optional()
});
