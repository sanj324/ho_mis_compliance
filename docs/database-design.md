# Database Design

## Base Entity Pattern

- UUID primary keys on all major tables
- `createdAt`, `updatedAt` on all entities
- `deletedAt` on soft-deletable masters and business records
- `approvalState` on workflow-sensitive entities
- `branchId` on branch-scoped entities
- JSON fields reserved for compliance flags, audit snapshots, metadata, and report parameters

## Core Areas

### Governance
- `Branch`, `Department`, `User`, `Role`, `Permission`, `UserRole`, `RolePermission`
- `ApprovalMatrix`, `UserSession`, `PasswordResetToken`

### Control Layer
- `AuditLog`
- `ComplianceRule`, `ComplianceEvent`, `ComplianceCalendarItem`
- `DocumentAttachment`
- `Notification`

### Accounting / Reporting
- `ChartOfAccount`, `LedgerEventMapping`, `Voucher`, `VoucherLine`
- `ReportMaster`, `ReportGenerationHistory`

### Business Modules
- Payroll: `Employee`, `SalaryStructure`, `PayrollRun`, `PayrollRunLine`
- Investments: `Issuer`, `Counterparty`, `Broker`, `Investment`
- Assets: `AssetCategory`, `Asset`
- Stationery: `ItemCategory`, `Vendor`, `InventoryItem`, `InventoryTransaction`
- Share Capital: `ShareClass`, `Member`

## Index Strategy

- Branch + date indexes for operational reporting
- Module + status + severity indexes for compliance workloads
- Entity + module indexes for document and audit retrieval
- Unique business key constraints on codes and reference numbers
- User/session indexes for auth and token lifecycle

## Reporting Readiness

- Month/year fields preserved where aggregation matters
- Approval and status fields retained for pendency views
- Branch dimensions available for HO rollups
- JSON fields reserved for flexible regulatory payload enrichment
