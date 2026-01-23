import type { Request, Response } from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HttpError } from "../../utils/httpError.js";

import {
  createProjectSchema,
  idParamSchema,
  paginationQuerySchema,
  updateProjectSchema
} from "./projects.schema.js";
import {
  createProject,
  listProjects,
  softDeleteProject,
  updateProject
} from "./projects.service.js";

export const postProject = [
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const dto = createProjectSchema.parse(req.body);

    const userId = req.user?.id;
    if (!userId) throw new HttpError(401, "Unauthorized");

    const data = await createProject({
      name: dto.name,
      description: dto.description ?? "No Description",
      status: dto.status ?? "ACTIVE",
      createdById: userId
    });

    res.status(201).json({ data });
  })
];

export const getProjects = [
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = paginationQuerySchema.parse(req.query);
    const data = await listProjects(page, limit, search);
    res.status(200).json({ data });
  })
];

export const patchProject = [
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const dto = updateProjectSchema.parse(req.body);

    const updateDto: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "ARCHIVED";
    } = {};

    if (typeof dto.name === "string") updateDto.name = dto.name;
    if (typeof dto.description === "string") updateDto.description = dto.description;
    if (dto.status) updateDto.status = dto.status;

    const data = await updateProject(id, updateDto);
    res.status(200).json({ data });
  })
];

export const deleteProject = [
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await softDeleteProject(id);
    res.status(200).json({ data });
  })
];
