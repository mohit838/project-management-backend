import { Router } from "express";

import { login, logout, refresh } from "./auth.controller.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "auth", ok: true }));

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
