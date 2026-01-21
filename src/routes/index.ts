import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import projectRoutes from "../modules/projects/projects.routes.js";
import userRoutes from "../modules/users/users.routes.js";

const router = Router();

router.get("/", (_req, res) => res.json({ message: "API root" }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

export default router;
