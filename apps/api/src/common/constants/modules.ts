import { ModuleName } from "../enums/module-name.enum.js";

export const MODULES = {
  AUTH: ModuleName.AUTH,
  USERS: ModuleName.USERS,
  BRANCHES: ModuleName.BRANCHES,
  AUDIT: ModuleName.AUDIT,
  DASHBOARD: ModuleName.DASHBOARD
} as const;
