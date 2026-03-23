# Phase 1 Setup

## Environment

### Root
- optional `NODE_ENV`

### API
- `PORT`
- `API_PREFIX`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL_MINUTES`
- `JWT_REFRESH_TTL_DAYS`
- `CORS_ORIGIN`

## Installation

```bash
pnpm install
pnpm --filter @ho-mis/api prisma:generate
pnpm --filter @ho-mis/api prisma:db:push
pnpm --filter @ho-mis/api prisma:seed
pnpm build
```

## Run

```bash
pnpm dev
```
