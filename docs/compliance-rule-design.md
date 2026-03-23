# Compliance Rule Design

## Rule Model

- `ruleCode`
- `moduleName`
- `entityName`
- `title`
- `description`
- `severity`
- `triggerEvent`
- `dueDays`
- `escalationRoleCode`
- `isActive`

## Event Model

- `moduleName`
- `entityName`
- `entityId`
- `ruleCode`
- `ruleDescription`
- `severity`
- `branchId`
- `status`
- `detectedOn`
- `dueDate`
- `escalatedTo`
- `remarks`
- `closedBy`
- `closedOn`

## Initial Rule Families

- employee PAN/Aadhaar/KYC deficiency
- payroll statutory mismatch
- investment maturity alert
- investment exposure breach
- asset insurance expiry
- stationery reorder breach
- member/share KYC deficiency
- approval aging
- regulatory filing due and overdue
