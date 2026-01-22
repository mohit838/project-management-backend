import crypto from "crypto";

import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

import { env } from "../../config/env.js";
import { sendInviteEmail } from "../../lib/email.js";
import { signAccessToken, signRefreshToken } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";

export async function loginWithEmailPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new HttpError(401, "Invalid credentials");
  if (user.status === "INACTIVE") throw new HttpError(403, "User is inactive");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const accessToken = signAccessToken({ sub: user.id, role: user.role });

  const refreshToken = signRefreshToken({ sub: user.id, v: Date.now() });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
}

export async function issueAccessTokenFromRefresh(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new HttpError(401, "Invalid refresh token");
  if (user.status === "INACTIVE") throw new HttpError(403, "User is inactive");

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, v: Date.now() });

  return { accessToken, refreshToken };
}

// Invitation
export async function createInviteAndSendEmail(email: string, role: UserRole) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const invite = await prisma.invite.create({
    data: { email, role, token, expiresAt }
  });

  const inviteLink = `${env.APP_URL}/register?token=${invite.token}`;

  await sendInviteEmail(email, inviteLink);

  return { id: invite.id, email: invite.email, role: invite.role, expiresAt: invite.expiresAt };
}

export async function registerUsingInvite(token: string, name: string, password: string) {
  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite) throw new HttpError(400, "Invalid invite token");
  if (invite.acceptedAt) throw new HttpError(400, "Invite already used");
  if (invite.expiresAt.getTime() < Date.now()) throw new HttpError(400, "Invite expired");

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existingUser) throw new HttpError(409, "User already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: invite.email,
      passwordHash,
      role: invite.role,
      status: "ACTIVE",
      invitedAt: new Date()
    }
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() }
  });

  return { id: user.id, email: user.email, role: user.role };
}
