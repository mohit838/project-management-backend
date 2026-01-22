import nodemailer from "nodemailer";

import { env } from "../config/env.js";

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export async function sendInviteEmail(to: string, inviteLink: string) {
  await mailer.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "You are invited - Project Management",
    text: `You have been invited. Complete your registration here: ${inviteLink}`,
    html: `
      <p>You have been invited to Project Management.</p>
      <p><a href="${inviteLink}">Click here to complete registration</a></p>
      <p>This link validate only for 24hr</p>
      <p>If you did not expect this email, ignore it.</p>
    `
  });
}
