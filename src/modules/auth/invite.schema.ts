import pkg, { type UserRole as PrismaUserRole } from "@prisma/client";
import z from "zod";

const { UserRole } = pkg;
type UserRole = PrismaUserRole;

export const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(UserRole).default("STAFF")
});

export type InviteDto = z.infer<typeof inviteSchema>;

export const registerViaInviteSchema = z.object({
  token: z.string().min(10),
  name: z.string().min(1),
  password: z.string().min(6)
});
export type RegisterViaInviteDto = z.infer<typeof registerViaInviteSchema>;
