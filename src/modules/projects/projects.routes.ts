import { Router } from "express";

import { deleteProject, getProjects, patchProject, postProject } from "./projects.controller.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ module: "projects", ok: true }));

router.post("/", ...postProject);
router.get("/", ...getProjects);
router.patch("/:id", ...patchProject);
router.delete("/:id", ...deleteProject);

export default router;
