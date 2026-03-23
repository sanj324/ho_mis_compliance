import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import { env } from "../../config/env.js";
import type { AuthTokenPayload } from "../../core/auth/auth.types.js";

export const signAccessToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.JWT_ACCESS_TTL_MINUTES}m`
  });

export const signRefreshToken = (payload: AuthTokenPayload): string =>
  jwt.sign({ ...payload, jti: randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_TTL_DAYS}d`
  });

export const verifyAccessToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;

export const verifyRefreshToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthTokenPayload;
