# UAT Demo Cycle

This project now seeds a reusable UAT dataset so the application can be demonstrated end-to-end after running:

```bash
pnpm --filter @ho-mis/api prisma:seed
```

## Demo Logins

- `admin.ho` / `Admin@123`
- `manager.br001` / `Manager@123`
- `operator.br001` / `DataEntry@123`

## Seeded UAT Story

### Governance and Masters

- Head Office and Pune Branch are available.
- Departments, designations, and cost centers are preloaded.
- Notifications, report generation history, approval inbox items, documents, and audit logs are seeded.

### Payroll

- Employees `EMP001` and `EMP002` are seeded.
- `EMP002` has incomplete Aadhaar verification to trigger a payroll exception.
- Attendance for March 2026 is seeded.
- Approved and pending leave records are seeded.
- Payroll month `March 2026` and payroll run `PR-2026-03-HO` are available.
- Payroll exception, compliance event, voucher posting, and approval task are available.

### Investments

- Security types, issuers, counterparties, and brokers are seeded.
- Investments `INV001` and `INV002` are available.
- `INV002` intentionally breaches policy monitoring to demonstrate exception handling.
- Accruals, transactions, exposure snapshot, document, compliance event, and approval task are available.

### Assets

- Asset `AST001` is active and has an expired insurance scenario for renewal follow-up.
- Asset `AST002` is seeded as a disposal scenario.
- Insurance, depreciation runs, transfer, verification, disposal, exception, notification, document, and approval task records are available.

### Stationery

- Stationery items, vendor, requisition, stock issue, transfer, stock ledger, low-stock exception, notification, and document records are seeded.
- This supports stock movement and reorder demo flows.

### Share Capital

- Members `MEM001` and `MEM002` are seeded with KYC records.
- Allotment, transfer, redemption, dividend declaration, dividend payment, exception, and approval task records are available.

## Suggested Demo Walkthrough

1. Login as `admin.ho`.
2. Open Notifications, Audit Trail, Approval Inbox, and Reports to show seeded governance activity.
3. Open Payroll and review:
   - employees
   - KYC status
   - attendance
   - leave request
   - payroll run
   - payroll exception
4. Open Compliance and show open payroll and investment events.
5. Open Investments and show:
   - investment master data
   - exposure snapshot
   - policy exception on `INV002`
6. Open Assets and show:
   - `AST001` insurance renewal case
   - `AST002` disposal approval case
   - verification and transfer history
7. Open Stationery and show:
   - requisition
   - issue
   - transfer
   - low stock alert
8. Open Share Capital and show:
   - member allotment
   - transfer
   - redemption
   - dividend payment pending

## Quick UAT Checkpoints

- Approval inbox should contain seeded tasks for payroll, investments, assets, leave, and share capital.
- Notifications should show seeded payroll, asset, and stationery alerts.
- Audit trail should show seeded login and operational activity.
- Reports should show generated output history entries.

## Note

The seed is designed to be rerunnable. It updates fixed demo keys like `AST001`, `INV002`, `REQ-2026-0001`, and `PR-2026-03-HO` so the environment stays presentation-ready.
