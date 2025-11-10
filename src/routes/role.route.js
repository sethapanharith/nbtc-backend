import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Role Module
 */

/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin
 *               description:
 *                 type: string
 *                 example: Can access all system features
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: []
 *           examples:
 *             System Administrator Role:
 *               summary: System Administrator Role
 *               value:
 *                 name: System Administrator
 *                 description: "Full system access for system administration and management"
 *                 actions:
 *                   - 507f1f77bcf86cd799439020
 *                   - 507f1f77bcf86cd799439021
 *                   - 507f1f77bcf86cd799439022
 *                   - 507f1f77bcf86cd799439023
 *                   - 507f1f77bcf86cd799439024
 *                   - 507f1f77bcf86cd799439025
 *                   - 507f1f77bcf86cd799439026
 *                   - 507f1f77bcf86cd799439027
 *                   - 507f1f77bcf86cd799439028
 *                   - 507f1f77bcf86cd799439029
 *                   - 507f1f77bcf86cd799439030 
 *     responses:
 *       201:
 *         description: Role created successfully, returns action information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: Created
 *                 message:
 *                   type: string
 *                   example: Action created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6902f4114157ba26a429fcd6
 *                     name:
 *                       type: string
 *                       example: CREATE_USER
 *                     description:
 *                       type: string
 *                       example: Can create new user
 *                     createdAt:
 *                       type: string
 *                       example: 2025-10-30T05:13:53.303Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-10-30T05:13:53.303Z
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: ValidationError
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: field
 *                         value:
 *                           type: string
 *                           example: CREATE_USER
 *                         msg:
 *                           type: string
 *                           example: CREATE_USER already exists
 *                         path:
 *                           type: string
 *                           example: name
 *                         location:
 *                           type: string
 *                           example: body
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: AuthenticationError
 *                 message:
 *                   type: string
 *                   example: Access denied, no token provided
 */

router.route("/").get(authenticate, getRoles).post(createRole);
router
  .route("/:id")
  .get(authenticate, getRoleById)
  .put(authenticate, updateRole)
  .delete(authenticate, deleteRole);

export default router;
