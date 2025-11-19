import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.js";
import { objectIdValidator } from "../validators/id.validator.js";
import { createContent } from "../controllers/content.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Contents
 *     description: Blood Donation Information
 */

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create content with uploaded images
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               sort:
 *                 type: number
 *               statement:
 *                 type: string
 *               list:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload image files
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post("/", authenticate, authorize(["Admin", "Staff"]), createContent);

export default router;
