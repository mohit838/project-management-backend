import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import projectRoutes from "../modules/projects/projects.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// NOTE: for test purpose
// router.get("/", (_req, res) => res.json({ message: "API root" }));

router.use("/auth", authRateLimiter, authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

export default router;
