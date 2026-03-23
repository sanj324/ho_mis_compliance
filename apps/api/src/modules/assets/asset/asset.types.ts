export type AssetFilters = {
  branchId?: string;
  status?: string;
  categoryId?: string;
};

export type AssetInput = {
  assetCode: string;
  assetName: string;
  assetCategoryId: string;
  depreciationMethodId: string;
  branchId: string;
  departmentId?: string | null;
  costCenterId?: string | null;
  purchaseDate: string;
  capitalizationDate: string;
  originalCost: number;
  usefulLifeMonths: number;
  depreciationRate: number;
  salvageValue?: number;
  insurancePolicyNo?: string | null;
  insuranceExpiryDate?: string | null;
  warrantyExpiryDate?: string | null;
  currentStatus?: string;
  currentHolder?: string | null;
  barcodeOrTagNo?: string | null;
};
