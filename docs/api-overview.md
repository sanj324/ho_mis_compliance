# API Overview

## Base conventions

- Base URL: `http://localhost:4000/api`
- Health route: `GET /health`
- Auth: `Authorization: Bearer <access-token>`
- Content type: `application/json`

## Response shape

Successful responses use:

```json
{
  "success": true,
  "message": "Human readable status",
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "message": "Human readable error",
  "details": {}
}
```

## Core routes

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard/ho-summary`
- `GET /api/payroll/dashboard/summary`
- `GET /api/investments/dashboard/summary`
- `GET /api/compliance/dashboard/summary`

### Payroll

- `GET /api/payroll/employees`
- `POST /api/payroll/employees`
- `GET /api/payroll/runs`
- `POST /api/payroll/runs/calculate`
- `POST /api/payroll/runs/finalize`
- `GET /api/payroll/reports/salary-register`

### Investments

- `GET /api/investments`
- `POST /api/investments`
- `GET /api/investments/exposure/checks`
- `GET /api/investments/reports/register`

### Compliance

- `GET /api/compliance/events`
- `GET /api/compliance/calendar`
- `POST /api/compliance/events/:id/close`

## Middleware expectations

- `authMiddleware` attaches `request.authUser` and request context when a token is present.
- `requirePermissions(...)` rejects unauthorized requests with `401` and insufficient permissions with `403`.
- Audit hooks currently cover the auth flow and should be extended in the same style for new mutating modules.

## Readiness endpoint

`GET /health` returns a lightweight readiness payload including:

- `status`
- `apiPrefix`
- `uptimeSeconds`
