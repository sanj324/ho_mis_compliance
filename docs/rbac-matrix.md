# RBAC Matrix

## Roles Seeded In Phase 1

- `HO_ADMIN`
- `BRANCH_MANAGER`
- `BRANCH_DATA_ENTRY`

## Permission Domains

- auth
- dashboard
- users
- branches
- auditLogs

## Functional Access

- `HO_ADMIN`
  - full access to dashboard, users, branches, audit logs
- `BRANCH_MANAGER`
  - dashboard read, branch read, user read within branch
- `BRANCH_DATA_ENTRY`
  - dashboard read, branch read
