import { Router } from "express";
import actionRoutes from "./action.route.js";
import roleRoutes from "./role.route.js";
import userRoute from "./user.route.js";
import authRoutes from "./auth.route.js";
import branchRoutes from "./branch.route.js";
import eventRoutes from "./event.route.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/action", actionRoutes);
router.use("/role", roleRoutes);
router.use("/user", userRoute);
router.use("/branch", branchRoutes);
router.use("/event", eventRoutes);

export default router;
