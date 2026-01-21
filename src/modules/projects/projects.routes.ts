import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "projects", ok: true }));

export default router;
