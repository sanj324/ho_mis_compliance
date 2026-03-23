export type StationeryDashboardSummary = {
  totalItems: number;
  lowStockCount: number;
  totalIssued: number;
  exceptionCount: number;
  stockSummary: Array<{
    itemCode: string;
    itemName: string;
    category: string;
    unitOfMeasure: string;
    reorderLevel: string;
    currentStock: string;
  }>;
};

export type StationeryItem = {
  id: string;
  itemCode: string;
  itemName: string;
  unitOfMeasure: string;
  reorderLevel: number;
  maxLevel: number;
  gstRate: number;
  itemCategory?: {
    id: string;
    code: string;
    name: string;
  } | null;
};

export type StationeryMasterItem = {
  id: string;
  code: string;
  name: string;
};
