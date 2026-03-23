# Deployment Guide

## 1. PostgreSQL

Provision a PostgreSQL database reachable by the API runtime.

Required API connection string:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>?schema=public
```

Recommended baseline:

- PostgreSQL 15 or 16
- daily backups
- point-in-time recovery enabled
- a dedicated database user with least privilege
- TLS enabled for non-local environments

Before starting the API, apply schema and seed if needed:

```bash
pnpm --filter @ho-mis/api prisma:generate
pnpm --filter @ho-mis/api prisma:db:push
pnpm --filter @ho-mis/api prisma:seed
```

## 2. API server

Required environment variables:

```env
PORT=4000
API_PREFIX=/api
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=replace-with-long-access-secret
JWT_REFRESH_SECRET=replace-with-long-refresh-secret
JWT_ACCESS_TTL_MINUTES=30
JWT_REFRESH_TTL_DAYS=7
CORS_ORIGIN=https://your-web-domain.example
```

Build and run:

```bash
pnpm --filter @ho-mis/api build
node apps/api/dist/apps/api/src/server.js
```

If your host has issues with `corepack`, install pnpm explicitly first:

```bash
npm install -g pnpm@10.6.5
```

Operational checks:

- confirm `GET /health` returns `200`
- confirm login works with a seeded or provisioned user
- confirm DB connectivity from the app host
- confirm logs are captured from stdout/stderr

### Render deployment

This repo now includes a root-level `render.yaml` that provisions:

- one PostgreSQL database: `ho-mis-db`
- one Node web service: `ho-mis-api`

Recommended Render flow:

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and point it at the GitHub repo.
3. If Render fails while resolving `pnpm` through `corepack`, use:
   - Build command: `npm install -g pnpm@10.6.5 && pnpm install --frozen-lockfile && pnpm --filter @ho-mis/api prisma:generate && pnpm --filter @ho-mis/api build`
4. Set `CORS_ORIGIN` to your final Vercel frontend URL.
5. After the first deploy, verify:
   - `GET /health`
   - DB schema push completed
   - login works

## 3. Web frontend

Required environment variable:

```env
VITE_API_BASE_URL=https://your-api-domain.example/api
```

Build:

```bash
pnpm --filter @ho-mis/web build
```

Deploy the generated `apps/web/dist` folder to your static host or CDN.

### Vercel deployment

This repo now includes a root-level `vercel.json` for deploying the Vite web app from the monorepo root.

Recommended Vercel flow:

1. Import the GitHub repository into Vercel.
2. Keep the project root at the repository root.
3. Set:
   - `VITE_API_BASE_URL=https://<your-render-api-domain>/api`
4. Deploy and verify:
   - login page renders
   - API calls reach the Render API
   - protected routes work after sign-in

Operational checks:

- verify login page renders
- verify protected routes load after sign-in
- verify `403` and `404` routes render correctly
- verify API calls point to the deployed API base URL

## 4. CI/CD notes

The included GitHub Actions workflow expects:

- Node.js 22
- pnpm 10.6.5
- PostgreSQL service for API tests

Recommended promotion order:

1. install
2. Prisma generate
3. schema apply
4. seed for non-production environments
5. lint
6. typecheck
7. build
8. tests
9. deploy
