export type AssetDashboardSummary = {
  totalAssets: number;
  totalOriginalCost: number;
  totalNetBookValue: number;
  insuranceExpiring: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
};

export type AssetMasterItem = {
  id: string;
  code: string;
  name: string;
};

export type AssetItem = {
  id: string;
  assetCode: string;
  assetName: string;
  originalCost: number;
  netBookValue: number;
  currentStatus: string;
  insurancePolicyNo: string | null;
  insuranceExpiryDate: string | null;
  branch?: { id: string; name: string } | null;
  assetCategory?: { id: string; code: string; name: string } | null;
  depreciationMethod?: { id: string; code: string; name: string } | null;
};
