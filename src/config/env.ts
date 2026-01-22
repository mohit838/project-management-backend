import "dotenv/config";
import type { StringValue } from "ms";
import { z } from "zod";

const durationSchema = z
  .string()
  // NOTE: supports: 15m, 7d, 1h, 30s, 500ms, 2w, 1y
  .regex(/^\d+(ms|s|m|h|d|w|y)$/)
  .transform((v) => v as StringValue);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  // Database
  DATABASE_URL: z.string().min(1).describe("Database connection URL"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
  JWT_ACCESS_EXPIRES_IN: durationSchema.default("15m"),
  JWT_REFRESH_EXPIRES_IN: durationSchema.default("7d"),

  // Cookies
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
  REFRESH_COOKIE_NAME: z.string().min(1),

  // Email
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  APP_URL: z.url()
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = (() => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
})();
