import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/user.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User Module
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users with pagination, sorting, and filtering
 *     description: Retrieves a paginated list of users with optional search, role filtering, branch filtering, and status filtering capabilities.
 *     tags: [Users]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of users to return per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: page
 *         in: query
 *         description: page number
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: sort
 *         in: query
 *         description: Sort users by specified fields (e.g., "createdAt:desc,email:asc")
 *         required: false
 *         schema:
 *           type: string
 *           example: createdAt:desc,firstName:asc
 *       - name: populate
 *         in: query
 *         description: Fields to populate (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *           example: roleId,branchId
 *     responses:
 *       200:
 *         description: Successful response with paginated users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, getUsers);

router.post("/register-with-info", createUser);

// router.route("/").get(protect, getUsers);
router
  .route("/:id")
  .get(authenticate, getUserById)
  .put(authenticate, updateUser)
  .delete(authenticate, deleteUser);

export default router;
