import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/user.controller.js";
import { userValidator } from "../validators/user.validator.js";
import { validateRequest } from "../middlewares/validation.js";

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
 *     responses:
 *       200:
 *         description: Successful response with paginated users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, authorize(["Admin"]), getUsers);
/**
 * @swagger
 * /api/user/register-with-info:
 *   post:
 *     summary: create a new user with user info
 *     description: this route for general use, no authentication or authorization need.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: cadt
 *               fullName:
 *                 type: string
 *                 example: Cambodia Academy of Digital Technology
 *               password:
 *                 type: string
 *                 example: cadt123
 *                 description: password at least 6 or more
 *               roleId:
 *                 type: array
 *                 example: []
 *               branchId:
 *                 type: string
 *                 example: null
 *               userInfo:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: CADT
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: CADT
 *                   gender:
 *                     type: string
 *                     enum: [M, F, Other]
 *                     example: Other
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: 1990-01-01
 *                   maritalStatus:
 *                     type: string
 *                     enum: [Single, Married, Divorced, Widowed, Other]
 *                     example: Other
 *                   occupation:
 *                     type: string
 *                     example: Digital and Technology
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   phoneNumber:
 *                     type: string
 *                     example: 012-456-789
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: info@cadt.gov.kh
 *                   identifications:
 *                     type: object
 *                     properties:
 *                       cardType:
 *                         type: string
 *                         example: "CADT Card"
 *                       cardCode:
 *                         type: string
 *                         example: "123456789"
 *             required:
 *               - username
 *               - fullName
 *               - password
 *               - userInfo
 *     responses:
 *       200:
 *         description: Successful response with paginated users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/register-with-info", userValidator, validateRequest, createUser);

// router.route("/").get(protect, getUsers);
router
  .route("/:id")
  .get(authenticate, authorize(["Admin", "Staff"]), getUserById)
  .put(authenticate, authorize(["Admin", "Staff"]), updateUser)
  .delete(authenticate, authorize(["Admin", "Staff"]), deleteUser);

export default router;
