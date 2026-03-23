export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ExecutiveSummary = {
  totalBranches: number;
  pendingApprovals: number;
  overdueComplianceItems: number;
  totalInvestmentExposure: number;
  monthlyPayrollCost: number;
  totalActiveAssets: number;
  lowStockItems: number;
  totalShareCapital: number;
  kycDeficientRecords: number;
  auditExceptionsOpen: number;
  regulatoryFilingsUpcoming: number;
};

export type ModuleReadiness = {
  moduleKey: string;
  title: string;
  phase: string;
  backendStatus: "READY" | "IN_PROGRESS" | "PENDING";
  frontendStatus: "READY" | "IN_PROGRESS" | "PENDING";
  notes: string;
};
