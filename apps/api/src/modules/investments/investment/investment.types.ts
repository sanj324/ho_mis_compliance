export type InvestmentFilters = {
  branchId?: string;
  classification?: string;
  rating?: string;
};

export type InvestmentInput = {
  investmentCode: string;
  securityName: string;
  isin?: string;
  branchId: string;
  securityTypeId: string;
  issuerId?: string;
  counterpartyId?: string;
  brokerId?: string;
  classification: "HTM" | "AFS" | "HFT";
  purchaseDate: string;
  maturityDate?: string;
  couponRate?: number;
  faceValue: number;
  bookValue: number;
  marketValue?: number;
  yieldRate?: number;
  rating?: string;
  policyLimit?: number;
};
