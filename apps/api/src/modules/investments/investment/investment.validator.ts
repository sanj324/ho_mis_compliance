import { z } from "zod";

export const investmentQuerySchema = z.object({
  branchId: z.string().uuid().optional(),
  classification: z.enum(["HTM", "AFS", "HFT"]).optional(),
  rating: z.string().optional()
});

export const createInvestmentSchema = z.object({
  investmentCode: z.string().min(2).max(30),
  securityName: z.string().min(3).max(150),
  isin: z.string().max(30).optional(),
  branchId: z.string().uuid(),
  securityTypeId: z.string().uuid(),
  issuerId: z.string().uuid().optional(),
  counterpartyId: z.string().uuid().optional(),
  brokerId: z.string().uuid().optional(),
  classification: z.enum(["HTM", "AFS", "HFT"]),
  purchaseDate: z.string().datetime(),
  maturityDate: z.string().datetime().optional(),
  couponRate: z.number().nonnegative().optional(),
  faceValue: z.number().nonnegative(),
  bookValue: z.number().nonnegative(),
  marketValue: z.number().nonnegative().optional(),
  yieldRate: z.number().nonnegative().optional(),
  rating: z.string().max(30).optional(),
  policyLimit: z.number().nonnegative().optional()
});

export const updateInvestmentSchema = createInvestmentSchema.partial().omit({
  investmentCode: true
});
