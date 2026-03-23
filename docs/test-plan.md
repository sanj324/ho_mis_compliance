# Test Plan

## Objective

Phase 5 adds a starter backend integration test layer focused on release safety rather than full feature coverage.

## Current automated coverage

### Auth

- health route is reachable
- seeded admin login succeeds
- refresh token flow succeeds
- auth audit entries are written

### RBAC

- anonymous access to protected routes returns `401`
- authorized permission set returns `200`
- missing permission returns `403`

### Payroll

- payroll dashboard summary returns seeded aggregates
- employee listing returns seeded records

### Investments

- investment dashboard summary returns seeded aggregates
- investment listing returns seeded records

### Compliance

- compliance dashboard and calendar return seeded data
- open compliance events can be closed

## Manual verification

- verify `GET /health`
- verify dashboard pages in the web app
- verify login/logout in the browser
- verify seed rerun does not create uncontrolled duplicates
- verify CI workflow passes from a clean checkout

## Suggested next test additions

- auth invalid credential and invalid refresh token paths
- mutation tests for payroll and investments create/update routes
- audit hook coverage for non-auth module writes
- web route/render smoke tests
- repository-level tests around compliance evaluation and report generation
