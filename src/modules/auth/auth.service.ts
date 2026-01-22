import bcrypt from "bcrypt";

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
