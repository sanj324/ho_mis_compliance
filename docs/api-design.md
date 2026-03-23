# API Design Notes

## Shared API Pattern

- `GET /list`
- `GET /:id`
- `POST /`
- `PATCH /:id`
- `DELETE /:id` as soft delete where permitted
- `POST /:id/approve`
- `POST /:id/reject`
- `GET /dashboard/summary`
- `GET /reports`
- `POST /export`
- `POST /:id/documents`

All endpoints will use:
- JWT auth middleware
- permission middleware
- Zod request validation
- centralized response formatting
- centralized audit hook

## Module Routes

### Auth / Governance
- `/auth/*`
- `/users/*`
- `/roles/*`
- `/permissions/*`
- `/branches/*`
- `/departments/*`
- `/approval-matrices/*`

### Payroll
- `/payroll/employees/*`
- `/payroll/salary-structures/*`
- `/payroll/runs/*`
- `/payroll/reports/*`

### Investments
- `/investments/masters/*`
- `/investments/register/*`
- `/investments/reports/*`

### Assets
- `/assets/categories/*`
- `/assets/register/*`
- `/assets/reports/*`

### Stationery
- `/stationery/items/*`
- `/stationery/vendors/*`
- `/stationery/transactions/*`
- `/stationery/reports/*`

### Share Capital
- `/share-capital/members/*`
- `/share-capital/share-classes/*`
- `/share-capital/reports/*`

### Cross-Module
- `/compliance/*`
- `/audit-logs/*`
- `/notifications/*`
- `/documents/*`
- `/dashboard/*`
- `/ledger/*`
- `/reports/*`
