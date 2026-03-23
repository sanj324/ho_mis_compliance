import { Router } from "express";

import { authRoutes } from "../core/auth/auth.routes.js";
import { auditRoutes } from "../core/audit/audit.routes.js";
import { complianceRoutes } from "../core/compliance/compliance.routes.js";
import { dashboardRoutes } from "../core/dashboard/dashboard.routes.js";
import { documentRoutes } from "../core/documents/document.routes.js";
import { ledgerRoutes } from "../core/ledger/ledger.routes.js";
import { notificationRoutes } from "../core/notifications/notification.routes.js";
import { assetRoutes } from "../modules/assets/asset.routes.js";
import { investmentRoutes } from "../modules/investments/investment.routes.js";
import { branchRoutes } from "../modules/masters/branch/branch.routes.js";
import { costCenterRoutes } from "../modules/masters/cost-center/costCenter.routes.js";
import { departmentRoutes } from "../modules/masters/department/department.routes.js";
import { designationRoutes } from "../modules/masters/designation/designation.routes.js";
import { payrollRoutes } from "../modules/payroll/payroll.routes.js";
import { shareCapitalRoutes } from "../modules/share-capital/shareCapital.routes.js";
import { stationeryRoutes } from "../modules/stationery/stationery.routes.js";
import { userRoutes } from "../modules/users/user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/compliance", complianceRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/documents", documentRoutes);
apiRouter.use("/ledger", ledgerRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/branches", branchRoutes);
apiRouter.use("/departments", departmentRoutes);
apiRouter.use("/designations", designationRoutes);
apiRouter.use("/cost-centers", costCenterRoutes);
apiRouter.use("/payroll", payrollRoutes);
apiRouter.use("/investments", investmentRoutes);
apiRouter.use("/assets", assetRoutes);
apiRouter.use("/stationery", stationeryRoutes);
apiRouter.use("/share-capital", shareCapitalRoutes);
apiRouter.use("/audit-logs", auditRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
