# HO MIS Compliance Workflow System Implementation Plan

## 1. Final Architecture Decision

### Style
- Modular monolith inside a monorepo.
- Strict backend layering: `route -> controller -> service -> repository`.
- Cross-cutting cores: auth, RBAC, audit, compliance, notifications, documents, ledger, reporting, dashboard.
- Domain modules: payroll, investments, assets, stationery, share capital, masters.
- Shared package strategy to keep DTOs, enums, and UI primitives reusable.

### Why This Shape
- Strong enough for regulated enterprise workflows today.
- Easier operational footprint than microservices for a first production rollout.
- Natural future extraction path by moving modules and cores behind async/event interfaces.
- Supports branch segregation, HO consolidation, maker-checker-authorizer, and audit-safe governance centrally.

## 2. Folder Structure

```text
/ho-mis-compliance
  /apps
    /api
    /web
  /packages
    /config
    /types
    /ui
    /utils
  /docs
```

Detailed structure is implemented in the repository scaffold.

## 3. Database Design Principles

### Base Entity Pattern
- `id` UUID primary key
- `createdAt`, `updatedAt`
- `deletedAt` for soft delete where applicable
- `createdById`, `updatedById` where governance matters
- `branchId` on branch-scoped entities
- `approvalState`, `recordStatus`, `isActive` where workflow/state control matters

### Core Design Rules
- PostgreSQL + Prisma normalized schema
- Enums for module, role, approval, compliance, notification, ledger states
- Audit and document linkage designed as shared cross-module tables
- Reporting-oriented indexes on branch, module, dates, status, approval state
- Unique business keys like employee code, member code, asset code, item code, investment code, voucher number

## 4. Module Delivery Sequence

### Phase 1
- Monorepo scaffold
- API bootstrap
- Web shell
- Auth, users, roles, permissions, branches, departments
- Audit core
- Dashboard shell

### Phase 2
- Masters framework
- Payroll & HR
- Investments
- Assets
- Stationery
- Share Capital

### Phase 3
- Compliance engine
- Notification engine
- Ledger posting engine
- Reporting engine
- Document attachments

### Phase 4
- Dashboard aggregation
- Exports
- Approvals
- Exception workflows
- Regulatory support reports

### Phase 5
- Testing
- Seed data
- Validation hardening
- Production readiness docs

## 5. API Design Notes by Module

### Auth / Governance
- `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/change-password`, `/auth/forgot-password`
- `/users`, `/roles`, `/permissions`, `/branches`, `/departments`, `/approval-matrices`
- All mutating endpoints audit logged and permission guarded

### Payroll
- Employee master, KYC, attendance, leave, salary structures, payroll runs, statutory setup, arrears, incentives, loans, recoveries, reports, payslips
- Branch and month scoped processing with lock after approval

### Investments
- Security masters, counterparties, issuers, brokers, purchase/sale/redemption/accrual entries
- Exposure monitoring, valuation analytics, maturity ladder, breach detection

### Assets
- Category, asset master, depreciation, insurance, warranty, transfer, revaluation, impairment, disposal, physical verification

### Stationery
- Item/category/vendor master, requisition, approval, purchase, receipt, issue, transfer, adjustments, reorder alerts

### Share Capital
- Member master, KYC, nominee, allotment, transfer, redemption, restrictions, dividend processing

### Cross-Module
- `/compliance/*`, `/documents/*`, `/notifications/*`, `/ledger/*`, `/reports/*`, `/dashboard/*`, `/audit-logs/*`

## 6. Frontend Page Map and Menu Structure

### Main Menu
- Dashboard
- Payroll & HR
- Investments
- Assets
- Stationery
- Share Capital
- Compliance
- Reports
- Approvals
- Audit Trail
- Masters
- Settings
- Users & Roles

### Page Pattern Per Module
- Dashboard summary
- List
- Create
- Edit
- Detail
- Approvals
- Reports

## 7. RBAC Matrix

### Governance Roles
- `SUPER_ADMIN`: global configuration and override powers
- `HO_ADMIN`: HO operational administration across modules
- `HO_COMPLIANCE`: compliance, filings, exceptions, due dates
- `HO_FINANCE`: ledger, vouchers, finance dashboards, reconciliations
- `HO_HR`: payroll and employee governance
- `HO_INVESTMENT`: investment lifecycle and exposure monitoring
- `HO_ASSET_MANAGER`: assets and depreciation control
- `HO_STATIONERY_MANAGER`: inventory and procurement control
- `HO_SHARE_MANAGER`: member shares and dividend governance
- `BRANCH_MANAGER`: branch oversight and approvals
- `BRANCH_DATA_ENTRY`: branch scoped maker operations
- `BRANCH_AUDITOR`: branch review and audit visibility
- `INTERNAL_AUDITOR`: enterprise audit visibility
- `STATUTORY_AUDITOR`: read-only compliance and reporting visibility
- `VIEW_ONLY_BOARD`: executive dashboard and curated reports only
- `APPROVER`, `CHECKER`, `MAKER`: workflow capability overlays

### Permission Categories
- read
- create
- update
- delete
- submit
- check
- approve
- reject
- export
- override
- administer

## 8. Audit Trail Strategy

- Central `AuditLog` table for CRUD, auth, workflow, export, override, posting, and compliance actions
- Store entity name, entity id, module, action type, old/new JSON snapshots, acting user, branch context, IP/device placeholders, reason, approval notes, correlation id
- Automatically triggered from middleware and service hooks
- Exportable with filters by user, module, branch, entity, action, date range

## 9. Regulatory / Compliance Rule Design

### Rule Dimensions
- Module
- Rule code
- Trigger event
- Severity
- Due date logic
- Escalation matrix
- Closure workflow

### Initial Rule Families
- KYC completeness
- PAN/Aadhaar/statutory identifiers missing
- Insurance expired
- Investment maturity approaching
- Exposure breach
- Payroll statutory deficiency
- Low stock / reorder breach
- Dividend restriction / member compliance issues
- Approval aging
- Filing due / overdue

## 10. Reporting Strategy

- Report master and parameterized execution
- Server-side query services returning table payloads plus totals
- Export adapters for PDF, Excel, CSV
- Generation history with user, filters, file metadata, and audit record
- Role-based access to report catalog and exports

## 11. Assumptions

- PostgreSQL is the primary transactional and reporting source in phase 1.
- Files are stored on controlled local or mounted storage initially, abstracted for future object storage.
- OTP/email/SMS delivery can be integrated later behind the notification provider abstraction.
- Exact RBI/NABARD formats remain configurable, but the data model and report engine will be ready for them.
