import { checkSchema } from "express-validator";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
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
    optional: true,
    custom: {
      options: (value) => !value || isValidObjectId(value),
      errorMessage: "branchId must be a valid MongoDB ObjectId",
    },
  },
  roleId: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "roleId must be an array of ObjectIds",
    },
  },
  "roleId.*": {
    optional: true,
    custom: {
      options: (value) => !value || isValidObjectId(value),
      errorMessage: "roleId must be a valid MongoDB ObjectId",
    },
  },

  // --- Nested userInfo Object ---
  userInfo: {
    in: ["body"],
    notEmpty: { errorMessage: "userInfo is required" },
  },
  "userInfo.firstName": {
    in: ["body"],
    notEmpty: { errorMessage: "First name is required" },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Only letters and spaces are allowed.",
    },
    trim: true,
  },
  "userInfo.lastName": {
    in: ["body"],
    notEmpty: { errorMessage: "Last name is required" },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Only letters and spaces are allowed.",
    },
    trim: true,
  },
  "userInfo.gender": {
    in: ["body"],
    notEmpty: { errorMessage: "Gender is required" },
    isIn: {
      options: [["M", "F", "Other"]],
      errorMessage: "Gender must be M, F, or Other.",
    },
  },
  "userInfo.dateOfBirth": {
    in: ["body"],
    notEmpty: { errorMessage: "Date of birth is required" },
    isISO8601: {
      options: { strict: true },
      errorMessage: "Date of Birth must be a valid ISO 8601 date (YYYY-MM-DD).",
    },
  },
  "userInfo.maritalStatus": {
    in: ["body"],
    notEmpty: { errorMessage: "Marital status is required" },
    isIn: {
      options: [["Single", "Married", "Divorced", "Widowed", "Other"]],
      errorMessage:
        "Marital status must be one of: Single, Married, Divorced, Widowed, Other",
    },
  },
  "userInfo.occupation": {
    in: ["body"],
    optional: true, // Assuming this is optional
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Occupation Only letters and spaces are allowed.",
    },
    trim: true,
  },
  "userInfo.address": {
    in: ["body"],
    optional: true, // Assuming this is optional
    trim: true,
  },
  "userInfo.phoneNumber": {
    in: ["body"],
    isString: { errorMessage: "Phone Number must be a string." },
    matches: {
      options: [/^(\+?\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{3}[\s-]?\d{3,4}$/],
      errorMessage:
        "Invalid phone number format. Allowed formats include: xxx-xxx-xxx, xxx-xxx-xxxx, xxxxxxxxx, xxxxxxxxxx, (+xxx) xxx-xxx, (+xxx) xxx-xxxx, +x (xxx) xxx-xxx, +x (xxx) xxx-xxxx",
    },
  },
  "userInfo.email": {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Must be a valid email address.",
    },
    normalizeEmail: true,
  },

  // --- Nested Array Fields Validation (using dot notation and wildcards) ---

  "userInfo.identifications": {
    in: ["body"],
    optional: true,
    isObject: {
      errorMessage: "Identifications must be an array.",
    },
    // You might add options to check if the array is not empty
  },

  // Use '.*' to validate fields within every object in the identifications array
  "userInfo.identifications.*.cardType": {
    in: ["body"],
    optional: true,
    trim: true,
  },
  "userInfo.identifications.*.cardCode": {
    in: ["body"],
    optional: true,
    trim: true,
  },
});
