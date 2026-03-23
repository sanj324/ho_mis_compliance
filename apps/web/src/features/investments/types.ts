export type InvestmentDashboardSummary = {
  totalCount: number;
  totalBookValue: number;
  totalMarketValue: number;
  byClassification: Array<{
    classification: string;
    count: number;
    bookValue: number;
  }>;
  byRating: Array<{
    rating: string;
    count: number;
    bookValue: number;
  }>;
  byMaturityBucket: Array<{
    bucket: string;
    count: number;
    bookValue: number;
  }>;
};

export type InvestmentMasterItem = {
  id: string;
  code: string;
  name: string;
  activeStatus: boolean;
};

export type InvestmentItem = {
  id: string;
  investmentCode: string;
  securityName: string;
  classification: string;
  purchaseDate: string;
  maturityDate: string | null;
  faceValue: number;
  bookValue: number;
  marketValue: number | null;
  yieldRate: number | null;
  rating: string | null;
  approvalState: string;
  securityType?: {
    id: string;
    code: string;
    name: string;
  } | null;
  issuer?: {
    id: string;
    code: string;
    name: string;
  } | null;
  counterparty?: {
    id: string;
    code: string;
    name: string;
  } | null;
  broker?: {
    id: string;
    code: string;
    name: string;
  } | null;
  branch?: {
    id: string;
    branchCode: string;
    branchName: string;
  } | null;
  maturityBucket?: string;
};

export type ExposureCheckResult = {
  issuerExposure: Array<{
    issuerName: string;
    totalBookValue: number;
    percentageOfPortfolio: number;
  }>;
  counterpartyExposure: Array<{
    counterpartyName: string;
    totalBookValue: number;
    percentageOfPortfolio: number;
  }>;
  exceptions: Array<{
    investmentCode: string;
    exceptionCode: string;
    message: string;
    severity: string;
  }>;
};

export type RegisterReportRow = {
  investmentCode: string;
  securityName: string;
  classification: string;
  issuer: string;
  counterparty: string;
  maturityDate: string;
  bookValue: string;
  marketValue: string;
  rating: string;
};

export type MaturityLadderRow = {
  bucket: string;
  count: number;
  totalBookValue: number;
};

export type ExposureSummaryRow = {
  category: string;
  name: string;
  totalBookValue: number;
  percentageOfPortfolio: number;
};
