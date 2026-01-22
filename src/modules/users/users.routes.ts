import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "users", ok: true }));

router.get("/me", requireAuth, (req, res) => {
  res.json({ data: req.user });
});

export default router;
