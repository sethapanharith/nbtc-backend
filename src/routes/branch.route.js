import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getBranches } from "../controllers/branch.controller.js";

const router = express.Router();
router.route("/").get(authenticate, getBranches);

export default router;
