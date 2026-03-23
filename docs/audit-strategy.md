# Audit Trail Strategy

## Capture Standard

Every important action will record:
- module
- entity name
- entity id
- action type
- acting user
- branch context
- timestamp
- old value snapshot
- new value snapshot
- reason / override note
- IP / device metadata placeholder
- request correlation id

## Covered Events

- login/logout
- create/update/delete
- submit/check/approve/reject
- exports
- document upload/download
- ledger posting and reversal
- compliance closure and waiver

## Storage and Retrieval

- Central `AuditLog` table
- Filterable by user, branch, module, entity, date, action
- Exportable as report dataset
- Linked into detail pages and approval histories
