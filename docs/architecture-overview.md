# Architecture Overview

## Phase 1 Architecture

- Monorepo with `pnpm` workspaces
- API application with Express + TypeScript + Prisma
- Web application with React + TypeScript + Vite + Tailwind CSS
- Shared packages for config, types, and utilities

## Backend Structure

- `config`: environment and logging
- `common`: constants, enums, middleware, validators, and core utilities
- `core/auth`: login, refresh, current-user flows
- `core/rbac`: permission resolution and enforcement
- `core/audit`: audit logging and retrieval
- `core/dashboard`: HO summary aggregation
- `modules/masters/branch`: branch master foundation
- `modules/users`: user master foundation

## Frontend Structure

- protected enterprise admin shell
- login page
- HO dashboard
- user list page
- branch list page
- audit log page

## Design Principles

- controllers stay thin
- services contain business logic
- repositories encapsulate Prisma access
- request context captures request id, user, roles, and branch
- audit logging is a first-class concern on mutating flows
