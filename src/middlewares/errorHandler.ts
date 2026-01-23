import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { HttpError } from "../utils/httpError.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: {
        code: "VALIDATION_ERROR",
        details: err.issues
      }
    });
  }

  // Our known HttpError
  if (err instanceof HttpError) {
    const code = err.code ?? "HTTP_ERROR";

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code,
        ...(err.details !== undefined ? { details: err.details } : {})
      }
    });
  }

  // Unknown/unhandled
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: { code: "INTERNAL_ERROR" }
  });
}
