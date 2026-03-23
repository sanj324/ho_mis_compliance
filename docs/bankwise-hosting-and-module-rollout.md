# Bank-Wise Hosting And Module Rollout

## 1. Objective

This document is the practical rollout guide for offering the application to multiple banks with:

- separate hosting per bank
- separate database per bank
- clear backend/frontend/API steps
- no module left half-defined during implementation
- export support for CBS-facing reports where data exists

Current recommendation for this codebase:

- frontend on Vercel
- API on Render
- one PostgreSQL database per bank
- one deployment per bank

This is the safest approach for demos and early customer onboarding because the current codebase is single-tenant and uses one `DATABASE_URL` at runtime.

## 2. Bank-Wise Hosting Model

### Recommended deployment unit

For each bank create:

1. one Vercel frontend project
2. one Render API service
3. one PostgreSQL database
4. one bank-specific environment configuration

Example:

- Bank A web: `https://bank-a-ho-mis.vercel.app`
- Bank A API: `https://bank-a-ho-mis-api.onrender.com`
- Bank A DB: dedicated PostgreSQL database

- Bank B web: `https://bank-b-ho-mis.vercel.app`
- Bank B API: `https://bank-b-ho-mis-api.onrender.com`
- Bank B DB: dedicated PostgreSQL database

### Why this model

- no cross-bank data mixing
- no tenant-routing logic required
- easier sales demo setup
- easier backup/restore per bank
- easier future migration to custom domains

## 3. Hosting Setup

### 3.1 Frontend on Vercel

Project settings:

- Root Directory: `apps/web`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `dist`

Required environment variable:

```env
VITE_API_BASE_URL=https://<bank-api-domain>/api
```

Add SPA route rewrite support using `vercel.json` in `apps/web` or project root.

Suggested rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3.2 API on Render

Use repo root as service root because the API depends on workspace packages.

Build command:

```bash
pnpm install --frozen-lockfile
pnpm --filter @ho-mis/api prisma:generate
pnpm --filter @ho-mis/api build
```

Start command:

```bash
node apps/api/dist/apps/api/src/server.js
```

Required API environment variables:

```env
NODE_ENV=production
PORT=10000
API_PREFIX=/api
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?schema=public
JWT_ACCESS_SECRET=<long-secret>
JWT_REFRESH_SECRET=<long-secret>
JWT_ACCESS_TTL_MINUTES=30
JWT_REFRESH_TTL_DAYS=7
CORS_ORIGIN=https://<bank-web-domain>
```

### 3.3 Database per bank

For each bank:

1. create PostgreSQL database
2. apply schema
3. seed initial data
4. create bank admin user
5. store DB URL only in that bank's API service

Setup commands:

```bash
pnpm --filter @ho-mis/api prisma:generate
pnpm --filter @ho-mis/api prisma:db:push
pnpm --filter @ho-mis/api prisma:seed
```

## 4. Core Rollout Sequence

Each module should be completed in this order:

1. Prisma schema
2. validators and types
3. repository
4. service
5. controller
6. routes and permissions
7. seed data
8. frontend service client
9. frontend pages and forms
10. dashboard tiles
11. reports
12. exports
13. tests
14. deployment and permission verification

## 5. Cross-Cutting Requirements For Every Module

Every module should support these capabilities before being marked complete:

- CRUD or transaction workflow
- validation on backend
- protected routes with permissions
- frontend page for list/view/create/edit where needed
- dashboard summary where relevant
- audit logging
- document attachment readiness where needed
- notification hooks where needed
- compliance rule hooks where needed
- CSV export
- Excel export
- PDF export
- seeded demo data
- typecheck/build pass

## 6. Module-By-Module Completion Plan

---

## 6.1 Governance

Includes:

- Users
- Branches
- Audit Logs
- Notifications
- Documents
- Ledger
- Departments
- Designations
- Cost Centers

### Backend

1. Confirm all master entities have full CRUD routes.
2. Ensure permission constants cover read/create/update/delete by module.
3. Ensure seed assigns all required permissions to HO admin and relevant branch roles.
4. Ensure audit logs exist for create/update/login and sensitive actions.
5. Add export endpoints for:
   - users
   - branches
   - audit logs
   - documents register
   - voucher register

### Frontend

1. Ensure each master page supports list and create.
2. Add edit where missing.
3. Add validation messages instead of silent failures.
4. Add export buttons per listing page.

### API

1. Standardize list filters:
   - branch
   - status
   - created date range
2. Standardize export endpoints:
   - `/export?format=csv|excel|pdf`

### Gaps to close

- permission constants file is incomplete versus actual route usage
- export coverage is not yet module-wide
- some seeded roles still need broader production permissions review

---

## 6.2 Compliance

Includes:

- compliance events
- compliance dashboard
- compliance calendar

### Backend

1. Extend compliance rules for all modules.
2. Add rule severity, due date, remarks, branch scope.
3. Add scheduled evaluation and manual rerun endpoint.
4. Add compliance exports:
   - open events
   - overdue events
   - calendar due list

### Frontend

1. Add filterable event views by severity, branch, status, module.
2. Add export buttons on events and calendar pages.
3. Show linked entity navigation from event to source module.

### API

1. Add filters in event and calendar list endpoints.
2. Add export endpoints for events and calendar.

### Gaps to close

- assets and stationery compliance rules are still narrow
- export coverage for compliance pages is not complete

---

## 6.3 Payroll

Includes:

- employees
- attendance
- salary structures
- payroll runs
- payroll reports
- statutory setup

### Backend

1. Complete employee CRUD and validation.
2. Complete attendance bulk upload with template and import validation.
3. Complete payroll calculate/finalize workflow.
4. Add filters by branch/month/year.
5. Add reports:
   - salary register
   - statutory deductions
   - employee exceptions
   - attendance summary
6. Add export endpoints for all reports.

### Frontend

1. Replace placeholder buttons with real forms or import flow.
2. Add branch selector and month/year selection.
3. Add validation before calculate/finalize.
4. Add export buttons on payroll reports.

### API

1. Support branch/month/year query params consistently.
2. Add downloadable outputs for all payroll reports.

### Gaps to close

- attendance and payroll run pages still have placeholder/demo-style UX
- import template and bank-ready workflow need proper UI

---

## 6.4 Investments

Includes:

- investment register
- investment form
- dashboard
- counterparties
- issuers
- brokers
- security types
- reports
- exposure checks

### Backend

1. Maintain route order so `/:id` does not shadow named routes.
2. Add full master CRUD where needed.
3. Add reports:
   - register
   - maturity ladder
   - exposure summary
   - exception register
4. Add export endpoints for each report.

### Frontend

1. Keep numeric normalization for decimal fields.
2. Add export buttons on reports.
3. Add validation for master create forms.

### API

1. Add filter params:
   - branch
   - classification
   - rating
   - maturity bucket
2. Add export endpoints for reports.

### Gaps to close

- master pages should show validation messages directly
- report exports are not yet complete across all investment report types

---

## 6.5 Assets

Includes:

- asset register
- asset form
- categories
- depreciation methods
- depreciation run
- insurance
- transfers
- disposals
- dashboard
- reports
- physical verification

### Backend

1. Add master fields:
   - `assetType`
   - `assetSubType`
   - `depreciationMethod`
   - `usefulLifeYears`
   - `slmRate`
   - `wdvRate`
   - `capitalizationThreshold`
2. Add asset register fields:
   - total cost
   - accumulated depreciation
   - net book value
   - insurance policy details
   - verification details
3. Expose physical verification routes and controller.
4. Add reports:
   - asset register
   - depreciation register
   - insurance expiry register
   - disposal register
   - transfer register
   - physical verification variance register
5. Add export endpoints for all reports.

### Frontend

1. Extend asset form with asset type and depreciation policy inputs.
2. Add verification page.
3. Add export buttons in reports page.
4. Add bank-ready field labels and validations.

### API

1. Add branch/category/status filters consistently.
2. Add export endpoints already started for reports.
3. Add verification endpoints and report exports.

### Gaps to close

- physical verification exists in backend service but is not fully exposed
- RBI-style asset master fields are not complete yet
- WDV should be configurable policy, not hard-coded as RBI default

---

## 6.6 Stationery

Includes:

- items
- categories
- vendors
- requisitions
- issues
- transfers
- stock register
- consumption report
- low stock report

### Backend

1. Add item master fields:
   - opening quantity
   - opening rate
   - opening value
   - min level
   - max level
   - reorder quantity
2. Extend stock ledger with value-based fields:
   - receipt rate
   - receipt value
   - issue rate
   - issue value
   - balance quantity
   - balance rate
   - balance value
3. Add reports:
   - stock register
   - item ledger
   - consumption report
   - low stock report
   - non-moving stock report
   - physical stock variance report
4. Add export endpoints for all reports.

### Frontend

1. Add item costing fields to item form.
2. Add receipt and issue workflow forms.
3. Add stock register and item ledger with value columns.
4. Add export buttons in reports page.

### API

1. Add branch/item/category/date range filters.
2. Add export endpoints already started for reports.
3. Extend report outputs to value-based CBS structure after schema change.

### Gaps to close

- current stationery stock register is quantity-based only
- item cost, total cost, issue rate, balance value are not stored yet
- full CBS stock accounting needs schema extension first

---

## 6.7 Share Capital

Includes:

- members
- share classes
- allotments
- transfers
- redemptions
- dividends
- reports

### Backend

1. Complete report routes and permissions.
2. Add reports:
   - member register
   - share register
   - allotment register
   - transfer register
   - redemption register
   - dividend register
   - KYC deficiency report
3. Add export endpoints for all.

### Frontend

1. Complete form validation on all workflows.
2. Add export buttons on reports page.
3. Add better error display for permission and validation failures.

### API

1. Add filters by branch, share class, member status, KYC status.
2. Standardize export endpoints.

### Gaps to close

- seeded permissions for reports need full review
- several share-capital report endpoints still need export parity

## 7. Report Export Standard

All reportable modules should follow one pattern:

- JSON view endpoint:
  - `/reports/<report-name>`
- export endpoint:
  - `/reports/<report-name>/export?format=csv`
  - `/reports/<report-name>/export?format=excel`
  - `/reports/<report-name>/export?format=pdf`

Minimum file naming:

- `<module>-<report>.csv`
- `<module>-<report>.xls`
- `<module>-<report>.pdf`

## 8. Bank Onboarding Checklist

For each new bank:

1. create database
2. create Render API service
3. create Vercel frontend project
4. set env vars
5. run Prisma generate
6. run DB push
7. run seed
8. create bank-specific admin user
9. configure domain/subdomain
10. verify login
11. verify reports
12. verify exports
13. hand over credentials and user guide

## 9. Immediate Next Engineering Steps

The next best sequence for this repo is:

1. add `vercel.json`
2. add Render deployment notes to repo root
3. complete permission seeds for all modules
4. finish Assets verification routes and UI
5. extend Stationery schema for costing and value-based stock register
6. add export parity for Payroll, Investments, Compliance, Governance, Share Capital
7. create one production start script for API
8. add smoke tests for exports and permissions

## 10. Decision Notes

- Use one deployment per bank with one DB per bank right now.
- Do not market the current app as true multi-tenant SaaS yet.
- Do not claim full CBS-valued stationery register until rate/value fields are added to schema.
- Use RBI-backed SLM defaults for assets where official basis exists.
- Treat WDV percentages as configurable bank policy unless a specific governing standard is formally adopted by the customer.
