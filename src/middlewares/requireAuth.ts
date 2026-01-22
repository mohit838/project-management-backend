import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "../utils/httpError.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing Authorization header"));
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}
