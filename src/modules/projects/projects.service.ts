import type { ProjectStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";

type ClientProjectStatus = Exclude<ProjectStatus, "DELETED">;

export async function createProject(input: {
  name: string;
  description?: string;
  status?: ClientProjectStatus;
  createdById: string;
}) {
  const data: {
    name: string;
    status: ClientProjectStatus;
    createdById: string;
    description?: string | null;
  } = {
    name: input.name,
    status: input.status ?? "ACTIVE",
    createdById: input.createdById
  };

  if (typeof input.description === "string") {
    data.description = input.description;
  }

  return prisma.project.create({
    data,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      isDeleted: true,
      deletedAt: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function listProjects(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { isDeleted: false };

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        isDeleted: true,
        deletedAt: true,
        createdById: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.project.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    meta: {
      pageNo: page,
      pageSize: limit,
      totalPages,
      totalElements: total
    }
  };
}

type UpdateData = {
  name?: string;
  description?: string | null;
  status?: ClientProjectStatus;
};

export async function updateProject(projectId: string, data: UpdateData) {
  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing || existing.isDeleted) throw new HttpError(404, "Project not found");

  // Build patch object without undefined values
  const patch: UpdateData = {};

  if (typeof data.name === "string") patch.name = data.name;
  if (typeof data.description === "string") patch.description = data.description;
  if (data.status) patch.status = data.status;

  return prisma.project.update({
    where: { id: projectId },
    data: patch,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      isDeleted: true,
      deletedAt: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function softDeleteProject(projectId: string) {
  const existing = await prisma.project.findUnique({ where: { id: projectId } });

  if (!existing || existing.isDeleted)
    throw new HttpError(404, "Project not found", { code: "PROJECT_NOT_FOUND" });

  return prisma.project.update({
    where: { id: projectId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      status: "DELETED"
    },
    select: {
      id: true,
      isDeleted: true,
      deletedAt: true,
      status: true,
      updatedAt: true
    }
  });
}
