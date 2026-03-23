# Production Checklist

## Application

- API secrets are stored in a secret manager, not in source control
- `CORS_ORIGIN` matches the deployed frontend domain
- `VITE_API_BASE_URL` points to the deployed API
- `GET /health` is wired into platform readiness checks
- log collection is configured for API runtime output

## Database

- PostgreSQL backups are scheduled and tested
- database credentials are rotated and least-privileged
- schema apply step is part of deployment
- seed runs only in approved environments

## Security

- JWT secrets are long, unique, and rotated per environment
- production users are provisioned outside of seeded admin credentials
- TLS is enforced on public endpoints
- access to DB and runtime hosts is restricted

## Quality gates

- CI passes lint, typecheck, build, and tests
- release candidate is verified against seeded/non-production data
- rollback plan is documented

## Operations

- alerting exists for API downtime and DB connectivity failures
- basic dashboard and auth smoke checks are documented
- deployment ownership and escalation contacts are clear
