import pkg, {
  type UserRole as PrismaUserRole,
  type UserStatus as PrismaUserStatus
} from "@prisma/client";
import { z } from "zod";

const { UserRole, UserStatus } = pkg;
type UserRole = PrismaUserRole;
type UserStatus = PrismaUserStatus;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  role: z.enum(UserRole).optional(),
  status: z.enum(UserStatus).optional()
});

export const idParamSchema = z.object({
  id: z.string().min(1)
});

export const updateRoleSchema = z.object({
  role: z.enum(UserRole)
});

export const updateStatusSchema = z.object({
  status: z.enum(UserStatus)
});
