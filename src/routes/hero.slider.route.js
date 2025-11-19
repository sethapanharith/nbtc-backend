import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
// import { validateRequest } from "../middlewares/validation.js";
import { objectIdValidator } from "../validators/id.validator.js";
import {
  createHeroSlider,
  getHeroSliderById,
  getHeroSliders,
  deleteFileById,
} from "../controllers/hero.slider.controller.js";
import { upload } from "../minio/index.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Hero Slider Events
 *     description: Hero Slider Management
 */
router.post(
  "/",
  authenticate,
  authorize(["Admin", "Staff"]),
  upload,
  createHeroSlider
);

router.get(
  "/",
  authenticate,
  getHeroSliders
);

router.get(
  "/:id",
  authenticate,
  objectIdValidator("param", "id"),
  getHeroSliderById
);

router.delete(
  "/:id",
  authenticate,
  authorize(["Admin", "Staff"]),
  objectIdValidator("param", "id"),
  deleteFileById
);

export default router;
