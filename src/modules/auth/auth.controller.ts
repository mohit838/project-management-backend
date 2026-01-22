import type { Request, Response } from "express";

import { env } from "../../config/env.js";
import { verifyRefreshToken } from "../../lib/jwt.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HttpError } from "../../utils/httpError.js";

import { loginSchema } from "./auth.schema.js";
import { issueAccessTokenFromRefresh, loginWithEmailPassword } from "./auth.service.js";

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/api/auth/refresh"
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/api/auth/refresh"
  });
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto = loginSchema.parse(req.body);

  const result = await loginWithEmailPassword(dto.email, dto.password);

  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    data: {
      accessToken: result.accessToken,
      user: result.user
    }
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[env.REFRESH_COOKIE_NAME] as string | undefined;
  if (!token) throw new HttpError(401, "Missing refresh token");

  const payload = verifyRefreshToken(token);

  const { accessToken, refreshToken } = await issueAccessTokenFromRefresh(payload.sub);

  setRefreshCookie(res, refreshToken);

  res.status(200).json({ data: { accessToken } });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearRefreshCookie(res);
  res.status(200).json({ message: "Logged out" });
});
