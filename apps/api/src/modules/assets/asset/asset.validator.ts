import { z } from "zod";

export const createAssetSchema = z.object({
  assetCode: z.string().min(2).max(30),
  assetName: z.string().min(2).max(150),
  assetCategoryId: z.string().uuid(),
  depreciationMethodId: z.string().uuid(),
  branchId: z.string().uuid(),
  departmentId: z.string().uuid().nullable().optional(),
  costCenterId: z.string().uuid().nullable().optional(),
  purchaseDate: z.string(),
  capitalizationDate: z.string(),
  originalCost: z.number().positive(),
  usefulLifeMonths: z.number().int().positive(),
  depreciationRate: z.number().nonnegative(),
  salvageValue: z.number().nonnegative().optional(),
  insurancePolicyNo: z.string().max(60).nullable().optional(),
  insuranceExpiryDate: z.string().nullable().optional(),
  warrantyExpiryDate: z.string().nullable().optional(),
  currentStatus: z.string().optional(),
  currentHolder: z.string().max(120).nullable().optional(),
  barcodeOrTagNo: z.string().max(60).nullable().optional()
});

export const updateAssetSchema = createAssetSchema.partial();
