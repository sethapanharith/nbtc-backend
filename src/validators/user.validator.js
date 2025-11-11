import { checkSchema } from "express-validator";
import userModel from "../models/user.model.js";

export const userValidator = checkSchema({
  username: {
    in: ["body"],
    trim: true,
    notEmpty: { errorMessage: "This field username cannot be empty" },
    isLength: {
      options: { max: 50 },
      errorMessage: "name must not exceed 50 characters",
    },
    matches: {
      options: [/^[A-Za-z_]+$/],
      errorMessage: "Only letters and underscores are allowed.",
    },
    custom: {
      options: async (value) => {
        const user = await userModel.findOne({ username: value });
        if (user) {
          throw new Error(`Username: ${value} already exists`);
        }
        return true;
      },
    },
  },
  password: {
    in: ["body"],
    trim: true,
    notEmpty: { errorMessage: "This field password cannot be empty" },
    isString: {
      errorMessage: "Password must contain letters.",
    },
    isLength: {
      options: { min: 6, max: 30 },
      errorMessage: "Password must be between 6 and 30 characters",
    },
  },
  fullName: {
    in: ["body"],
    trim: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "fullName must not exceed 50 characters",
    },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Only letters and spaces are allowed.",
    },
  },
  branchId: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isMongoId: { errorMessage: "Invalid branch ID" },
  },
  roleId: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isMongoId: { errorMessage: "Invalid role ID" },
    isArray: {
      errorMessage: "Role ID must be an array.",
    },
    custom: {
      options: (value) => {
        if (value.length !== 0) {
          for (const id of value) {
            // A simple regex check for a 24-character hex string (standard ObjectId)
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
              throw new Error("All Role IDs must be valid MongoDB ObjectIds.");
            }
          }
          return true;
        }
      },
    },
  },
  userInfo: {
    in: ["body"],
    notEmpty: { errorMessage: "This field userInfo cannot be empty" },
  },
});
