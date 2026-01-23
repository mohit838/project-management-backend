import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { HttpError } from "../../utils/httpError.js";

import {
  idParamSchema,
  paginationQuerySchema,
  updateRoleSchema,
  updateStatusSchema
} from "./users.schema.js";
import { changeUserRole, changeUserStatus, listUsers } from "./users.service.js";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, role, status } = paginationQuerySchema.parse(req.query);
  const data = await listUsers(page, limit, search, role, status);
  res.status(200).json({ data });
});

export const patchUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { role } = updateRoleSchema.parse(req.body);

  if (req.user?.id === id) {
    throw new HttpError(400, "You cannot change your own role");
  }

  const data = await changeUserRole(id, role);
  res.status(200).json({ data });
});

export const patchUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { status } = updateStatusSchema.parse(req.body);

  if (req.user?.id === id) {
    throw new HttpError(400, "You cannot change your own status");
  }

  const data = await changeUserStatus(id, status);
  res.status(200).json({ data });
});
