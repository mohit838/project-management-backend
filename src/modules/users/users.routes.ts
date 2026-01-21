import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "users", ok: true }));

export default router;
