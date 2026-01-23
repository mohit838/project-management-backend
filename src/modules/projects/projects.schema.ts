import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional()
});

export const idParamSchema = z.object({
  id: z.string().min(1)
});

const projectClientStatusSchema = z.enum(["ACTIVE", "ARCHIVED"]);

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: projectClientStatusSchema.optional()
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: projectClientStatusSchema.optional()
});
