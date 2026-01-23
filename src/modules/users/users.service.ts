import type { UserRole, UserStatus, Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";

export async function listUsers(
  page: number,
  limit: number,
  search?: string,
  role?: UserRole,
  status?: UserStatus
) {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }

  if (role) where.role = role;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        invitedAt: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
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

export async function changeUserRole(userId: string, role: UserRole) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "User not found", { code: "USER_NOT_FOUND" });

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, role: true, updatedAt: true }
  });
}

export async function changeUserStatus(userId: string, status: UserStatus) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "User not found");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, status: true, updatedAt: true }
  });
}
