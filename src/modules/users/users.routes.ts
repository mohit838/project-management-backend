import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";

import { getUsers, patchUserRole, patchUserStatus } from "./users.controller.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "users", ok: true }));

router.get("/", requireAuth, requireRole("ADMIN"), getUsers);
router.patch("/:id/role", requireAuth, requireRole("ADMIN"), patchUserRole);
router.patch("/:id/status", requireAuth, requireRole("ADMIN"), patchUserStatus);

export default router;
