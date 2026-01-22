import pkg, { type UserRole as PrismaUserRole } from "@prisma/client";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { createApp } from "../../app.js";

import * as authService from "./auth.service.js";

const { UserRole } = pkg;
type UserRole = PrismaUserRole;

vi.mock("./auth.service.js", () => ({
  loginWithEmailPassword: vi.fn(),
  createInviteAndSendEmail: vi.fn(),
  issueAccessTokenFromRefresh: vi.fn(),
  registerUsingInvite: vi.fn()
}));

describe("POST /api/auth/login", () => {
  it("should return 200 and user data on successful login", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: UserRole.ADMIN,
      status: "ACTIVE" as const
    };

    const mockResult = {
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
      user: mockUser
    };

    vi.mocked(authService.loginWithEmailPassword).mockResolvedValue(mockResult);

    const app = createApp();
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBe("access-token-123");
    expect(response.body.data.user.id).toBe("user-123");
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
