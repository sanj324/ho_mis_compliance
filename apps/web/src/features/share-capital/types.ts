export type ShareCapitalDashboardSummary = {
  totalMembers: number;
  activeMembers: number;
  totalShareCapital: number;
  kycDeficientMembers: number;
  frozenMembers: number;
  pendingDividendAmount: number;
  byShareClass: Array<{
    shareClass: string;
    totalShares: number;
    capitalValue: number;
  }>;
};

export type MemberItem = {
  id: string;
  memberCode: string;
  memberName: string;
  branchId: string;
  panNo: string | null;
  aadhaarNo: string | null;
  kycStatus: string;
  memberStatus: string;
  freezeStatus: boolean;
  lienStatus: boolean;
  registrarRefNo: string | null;
  currentBalance?: number;
  branch?: {
    id: string;
    code: string;
    name: string;
  } | null;
};

export type ShareClassItem = {
  id: string;
  code: string;
  name: string;
  faceValue: number;
  dividendRate: number | null;
  isActive: boolean;
};

export type DividendDeclarationItem = {
  id: string;
  shareClassId: string;
  declarationDate: string;
  dividendRate: number;
  approvalState: string;
};
