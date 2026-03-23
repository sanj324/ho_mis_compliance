import { z } from "zod";

export const createInsuranceSchema = z.object({
  assetId: z.string().uuid(),
  policyNo: z.string().min(2).max(60),
  insurerName: z.string().min(2).max(120),
  startDate: z.string(),
  expiryDate: z.string(),
  insuredValue: z.number().positive(),
  premiumAmount: z.number().nonnegative().optional()
});
