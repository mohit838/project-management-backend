import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "auth", ok: true }));

export default router;
