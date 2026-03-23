# HO MIS Compliance Workflow System

Head Office MIS and compliance workflow platform for regulated financial institutions, built as a `pnpm` monorepo with:

- `apps/api`: Express + Prisma + JWT + RBAC + audit/compliance services
- `apps/web`: React + Vite + TanStack Query + protected admin UI
- `packages/*`: shared config, types, and utility packages

Phase 5 adds starter backend integration tests, a CI workflow, richer seed data, production documentation, error pages, and a health check contract suitable for deployment readiness.

## Workspace

```text
/ho-mis-compliance
  /apps/api
  /apps/web
  /packages/config
  /packages/types
  /packages/utils
  /docs
  /.github/workflows
```

## Required environment variables

### API

```env
PORT=4000
API_PREFIX=/api
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ho_mis_compliance?schema=public
JWT_ACCESS_SECRET=replace-with-long-access-secret
JWT_REFRESH_SECRET=replace-with-long-refresh-secret
JWT_ACCESS_TTL_MINUTES=30
JWT_REFRESH_TTL_DAYS=7
CORS_ORIGIN=http://localhost:5173
```

### Web

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Local setup

1. Copy `apps/api/.env.example` to `apps/api/.env` and update values.
2. Set `VITE_API_BASE_URL` for the web app if you are not using the default API URL.
3. Install dependencies:

```bash
pnpm install
```

4. Generate Prisma client and apply schema:

```bash
pnpm --filter @ho-mis/api prisma:generate
pnpm --filter @ho-mis/api prisma:db:push
```

5. Seed sample data:

```bash
pnpm --filter @ho-mis/api prisma:seed
```

6. Run the apps:

```bash
pnpm --filter @ho-mis/api dev
pnpm --filter @ho-mis/web dev
```

## Build, lint, and test

```bash
pnpm --filter @ho-mis/api lint
pnpm --filter @ho-mis/api typecheck
pnpm --filter @ho-mis/api build
pnpm --filter @ho-mis/api test

pnpm --filter @ho-mis/web lint
pnpm --filter @ho-mis/web typecheck
pnpm --filter @ho-mis/web build
```

## Seeded users

- `admin.ho` / `Admin@123`
- `manager.br001` / `Manager@123`
- `operator.br001` / `DataEntry@123`

## Operational routes

- API health: `GET /health`
- API base: `/api`
- Web fallback error pages: `/forbidden` and unmatched route `404`

## Supporting docs

- [API overview](./docs/api-overview.md)
- [Bank-wise hosting and module rollout](./docs/bankwise-hosting-and-module-rollout.md)
- [Deployment guide](./docs/deployment-guide.md)
- [UAT demo cycle](./docs/uat-demo-cycle.md)
- [Test plan](./docs/test-plan.md)
- [Production checklist](./docs/production-checklist.md)
