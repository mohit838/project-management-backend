import type { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ message: "Route not found" });
}
