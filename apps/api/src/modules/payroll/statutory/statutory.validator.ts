import { z } from "zod";

export const createStatutorySetupSchema = z.object({
  branchId: z.string().uuid().optional(),
  effectiveFrom: z.string().datetime(),
  pfRateEmployee: z.number().nonnegative().optional(),
  pfRateEmployer: z.number().nonnegative().optional(),
  esiRateEmployee: z.number().nonnegative().optional(),
  esiRateEmployer: z.number().nonnegative().optional(),
  professionalTax: z.number().nonnegative().optional(),
  tdsRate: z.number().nonnegative().optional()
});
