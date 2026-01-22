import { Router } from "express";

import { invite, login, logout, refresh, registerViaInvite } from "./auth.controller.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "auth", ok: true }));

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Invitation
router.post("/invite", ...invite);
router.post("/register-via-invite", registerViaInvite);

export default router;
