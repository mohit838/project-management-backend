import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
};

export type RefreshTokenPayload = {
  sub: string;
  v: number;
};

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

const accessSignOptions: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN };
const refreshSignOptions: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN };

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessSecret, accessSignOptions);
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, refreshSecret, refreshSignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload & JwtPayload {
  return jwt.verify(token, accessSecret) as AccessTokenPayload & JwtPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload & JwtPayload {
  return jwt.verify(token, refreshSecret) as RefreshTokenPayload & JwtPayload;
}
