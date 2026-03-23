import { StatusCodes } from "http-status-codes";

import { AppError } from "../../common/errors/app-error.js";
import { AuditActionEnum } from "../../common/enums/audit-action.enum.js";
import { ModuleName } from "../../common/enums/module-name.enum.js";
import { comparePassword } from "../../common/utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../common/utils/jwt.js";
import { auditService } from "../audit/audit.service.js";
import { authRepository } from "./auth.repository.js";
import type { AuthTokenPayload, LoginInput, LoginResult } from "./auth.types.js";

const mapPayload = (user: NonNullable<Awaited<ReturnType<typeof authRepository.findUserById>>>): AuthTokenPayload => ({
  userId: user.id,
  username: user.username,
  fullName: user.fullName,
  branchId: user.branchId,
  roleCodes: user.userRoles.map((item) => item.role.code),
  permissionCodes: user.userRoles.flatMap((item) =>
    item.role.rolePermissions.map((rolePermission) => rolePermission.permission.code)
  )
});

export class AuthService {
  async login(input: LoginInput, requestId: string): Promise<LoginResult> {
    const user = await authRepository.findUserByUsername(input.username);

    if (!user) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const payload = mapPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await authRepository.createRefreshToken(
      refreshToken,
      user.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await auditService.record({
      moduleName: ModuleName.AUTH,
      entityName: "User",
      entityId: user.id,
      action: AuditActionEnum.LOGIN,
      requestId,
      userId: user.id,
      branchId: user.branchId,
      newValues: { username: user.username }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: payload.userId,
        username: payload.username,
        fullName: payload.fullName,
        branchId: payload.branchId,
        roleCodes: payload.roleCodes,
        permissionCodes: payload.permissionCodes
      }
    };
  }

  async refresh(refreshToken: string, requestId: string): Promise<LoginResult> {
    const tokenPayload = verifyRefreshToken(refreshToken);
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
    }

    const user = await authRepository.findUserById(tokenPayload.userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.UNAUTHORIZED);
    }

    const payload = mapPayload(user);
    const nextAccessToken = signAccessToken(payload);
    const nextRefreshToken = signRefreshToken(payload);
    await authRepository.createRefreshToken(
      nextRefreshToken,
      user.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await auditService.record({
      moduleName: ModuleName.AUTH,
      entityName: "RefreshToken",
      entityId: storedToken.id,
      action: AuditActionEnum.REFRESH,
      requestId,
      userId: user.id,
      branchId: user.branchId,
      newValues: { refreshed: true }
    });

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      user: {
        id: payload.userId,
        username: payload.username,
        fullName: payload.fullName,
        branchId: payload.branchId,
        roleCodes: payload.roleCodes,
        permissionCodes: payload.permissionCodes
      }
    };
  }

  me(payload: AuthTokenPayload) {
    return {
      id: payload.userId,
      username: payload.username,
      fullName: payload.fullName,
      branchId: payload.branchId,
      roleCodes: payload.roleCodes,
      permissionCodes: payload.permissionCodes
    };
  }
}

export const authService = new AuthService();
