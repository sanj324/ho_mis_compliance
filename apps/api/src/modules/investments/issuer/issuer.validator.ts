import { z } from "zod";

export const createIssuerSchema = z.object({
  code: z.string().min(2).max(30),
  name: z.string().min(3).max(120),
  issuerType: z.string().min(2).max(50),
  riskLimit: z.number().nonnegative().optional()
});
