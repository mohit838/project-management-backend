import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError.js";

export function requireRole(...allowed: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return next(new HttpError(401, "Unauthorized"));

    if (!allowed.includes(role)) {
      return next(new HttpError(403, "Forbidden"));
    }

    return next();
  };
}
