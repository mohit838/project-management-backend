import { rateLimit } from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // NOTE: Strict limit for auth routes
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts, please try again after 15 minutes"
  }
});
