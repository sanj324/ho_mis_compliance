import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import { AuditLogPage } from "../features/audit/pages/AuditLogPage";
import { AssetCategoryPage } from "../features/assets/pages/AssetCategoryPage";
import { AssetDashboardPage } from "../features/assets/pages/AssetDashboardPage";
import { AssetDisposalPage } from "../features/assets/pages/AssetDisposalPage";
import { AssetFormPage } from "../features/assets/pages/AssetFormPage";
import { AssetListPage } from "../features/assets/pages/AssetListPage";
import { AssetReportsPage } from "../features/assets/pages/AssetReportsPage";
import { AssetTransferPage } from "../features/assets/pages/AssetTransferPage";
import { DepreciationMethodPage } from "../features/assets/pages/DepreciationMethodPage";
import { DepreciationRunPage } from "../features/assets/pages/DepreciationRunPage";
import { InsurancePage } from "../features/assets/pages/InsurancePage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { BranchListPage } from "../features/branches/pages/BranchListPage";
import { ComplianceCalendarPage } from "../features/compliance/pages/ComplianceCalendarPage";
import { ComplianceDashboardPage } from "../features/compliance/pages/ComplianceDashboardPage";
import { ComplianceEventsPage } from "../features/compliance/pages/ComplianceEventsPage";
import { HODashboardPage } from "../features/dashboard/pages/HODashboardPage";
import { NotAuthorizedPage } from "../features/dashboard/pages/NotAuthorizedPage";
import { NotFoundPage } from "../features/dashboard/pages/NotFoundPage";
import { DocumentCenterPage } from "../features/documents/pages/DocumentCenterPage";
import { CostCenterListPage } from "../features/masters/pages/CostCenterListPage";
import { DepartmentListPage } from "../features/masters/pages/DepartmentListPage";
import { DesignationListPage } from "../features/masters/pages/DesignationListPage";
import { BrokerPage } from "../features/investments/pages/BrokerPage";
import { CounterpartyPage } from "../features/investments/pages/CounterpartyPage";
import { InvestmentDashboardPage } from "../features/investments/pages/InvestmentDashboardPage";
import { InvestmentFormPage } from "../features/investments/pages/InvestmentFormPage";
import { InvestmentListPage } from "../features/investments/pages/InvestmentListPage";
import { InvestmentReportsPage } from "../features/investments/pages/InvestmentReportsPage";
import { IssuerPage } from "../features/investments/pages/IssuerPage";
import { SecurityTypePage } from "../features/investments/pages/SecurityTypePage";
import { LedgerPostingPage } from "../features/ledger/pages/LedgerPostingPage";
import { VoucherListPage } from "../features/ledger/pages/VoucherListPage";
import { AttendancePage } from "../features/payroll/pages/AttendancePage";
import { EmployeeFormPage } from "../features/payroll/pages/EmployeeFormPage";
import { EmployeeListPage } from "../features/payroll/pages/EmployeeListPage";
import { PayrollDashboardPage } from "../features/payroll/pages/PayrollDashboardPage";
import { PayrollReportsPage } from "../features/payroll/pages/PayrollReportsPage";
import { PayrollRunPage } from "../features/payroll/pages/PayrollRunPage";
import { SalaryStructurePage } from "../features/payroll/pages/SalaryStructurePage";
import { NotificationCenterPage } from "../features/notifications/pages/NotificationCenterPage";
import { AllotmentPage } from "../features/share-capital/pages/AllotmentPage";
import { DividendPage } from "../features/share-capital/pages/DividendPage";
import { MemberFormPage } from "../features/share-capital/pages/MemberFormPage";
import { MemberListPage } from "../features/share-capital/pages/MemberListPage";
import { RedemptionPage } from "../features/share-capital/pages/RedemptionPage";
import { ShareCapitalDashboardPage } from "../features/share-capital/pages/ShareCapitalDashboardPage";
import { ShareCapitalReportsPage } from "../features/share-capital/pages/ShareCapitalReportsPage";
import { ShareClassPage } from "../features/share-capital/pages/ShareClassPage";
import { TransferPage } from "../features/share-capital/pages/TransferPage";
import { ItemFormPage as StationeryItemFormPage } from "../features/stationery/pages/ItemFormPage";
import { ItemListPage } from "../features/stationery/pages/ItemListPage";
import { RequisitionPage } from "../features/stationery/pages/RequisitionPage";
import { StationeryDashboardPage } from "../features/stationery/pages/StationeryDashboardPage";
import { StationeryReportsPage } from "../features/stationery/pages/StationeryReportsPage";
import { StockIssuePage } from "../features/stationery/pages/StockIssuePage";
import { StockTransferPage } from "../features/stationery/pages/StockTransferPage";
import { VendorPage } from "../features/stationery/pages/VendorPage";
import { UserListPage } from "../features/users/pages/UserListPage";

export const AppRouter = (): ReactElement => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forbidden" element={<NotAuthorizedPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<HODashboardPage />} />
      <Route path="users" element={<UserListPage />} />
      <Route path="branches" element={<BranchListPage />} />
      <Route path="audit-logs" element={<AuditLogPage />} />
      <Route path="compliance/dashboard" element={<ComplianceDashboardPage />} />
      <Route path="compliance/events" element={<ComplianceEventsPage />} />
      <Route path="compliance/calendar" element={<ComplianceCalendarPage />} />
      <Route path="notifications" element={<NotificationCenterPage />} />
      <Route path="documents" element={<DocumentCenterPage />} />
      <Route path="ledger/postings" element={<LedgerPostingPage />} />
      <Route path="ledger/vouchers" element={<VoucherListPage />} />
      <Route path="masters/departments" element={<DepartmentListPage />} />
      <Route path="masters/designations" element={<DesignationListPage />} />
      <Route path="masters/cost-centers" element={<CostCenterListPage />} />
      <Route path="payroll/dashboard" element={<PayrollDashboardPage />} />
      <Route path="payroll/employees" element={<EmployeeListPage />} />
      <Route path="payroll/employees/new" element={<EmployeeFormPage />} />
      <Route path="payroll/employees/:id" element={<EmployeeFormPage />} />
      <Route path="payroll/attendance" element={<AttendancePage />} />
      <Route path="payroll/salary-structures" element={<SalaryStructurePage />} />
      <Route path="payroll/runs" element={<PayrollRunPage />} />
      <Route path="payroll/reports" element={<PayrollReportsPage />} />
      <Route path="investments/dashboard" element={<InvestmentDashboardPage />} />
      <Route path="investments" element={<InvestmentListPage />} />
      <Route path="investments/new" element={<InvestmentFormPage />} />
      <Route path="investments/:id" element={<InvestmentFormPage />} />
      <Route path="investments/counterparties" element={<CounterpartyPage />} />
      <Route path="investments/security-types" element={<SecurityTypePage />} />
      <Route path="investments/issuers" element={<IssuerPage />} />
      <Route path="investments/brokers" element={<BrokerPage />} />
      <Route path="investments/reports" element={<InvestmentReportsPage />} />
      <Route path="assets/dashboard" element={<AssetDashboardPage />} />
      <Route path="assets" element={<AssetListPage />} />
      <Route path="assets/new" element={<AssetFormPage />} />
      <Route path="assets/:id" element={<AssetFormPage />} />
      <Route path="assets/categories" element={<AssetCategoryPage />} />
      <Route path="assets/depreciation-methods" element={<DepreciationMethodPage />} />
      <Route path="assets/depreciation-run" element={<DepreciationRunPage />} />
      <Route path="assets/insurance" element={<InsurancePage />} />
      <Route path="assets/transfers" element={<AssetTransferPage />} />
      <Route path="assets/disposals" element={<AssetDisposalPage />} />
      <Route path="assets/reports" element={<AssetReportsPage />} />
      <Route path="stationery/dashboard" element={<StationeryDashboardPage />} />
      <Route path="stationery/items" element={<ItemListPage />} />
      <Route path="stationery/items/new" element={<StationeryItemFormPage />} />
      <Route path="stationery/vendors" element={<VendorPage />} />
      <Route path="stationery/requisitions" element={<RequisitionPage />} />
      <Route path="stationery/issues" element={<StockIssuePage />} />
      <Route path="stationery/transfers" element={<StockTransferPage />} />
      <Route path="stationery/reports" element={<StationeryReportsPage />} />
      <Route path="share-capital/dashboard" element={<ShareCapitalDashboardPage />} />
      <Route path="share-capital/members" element={<MemberListPage />} />
      <Route path="share-capital/members/new" element={<MemberFormPage />} />
      <Route path="share-capital/members/:id" element={<MemberFormPage />} />
      <Route path="share-capital/share-classes" element={<ShareClassPage />} />
      <Route path="share-capital/allotments" element={<AllotmentPage />} />
      <Route path="share-capital/transfers" element={<TransferPage />} />
      <Route path="share-capital/redemptions" element={<RedemptionPage />} />
      <Route path="share-capital/dividends" element={<DividendPage />} />
      <Route path="share-capital/reports" element={<ShareCapitalReportsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
