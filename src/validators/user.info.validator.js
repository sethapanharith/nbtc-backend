import { checkSchema } from "express-validator";
import userInfoModel from "../models/user.info.model.js";
// import mongoose from "mongoose";

// const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const emailUniqueValidator = async (email, { req }) => {
  if (!email) return true;

  // For update operation, check if ID exists and skip if same email
  if (req.params?.id) {
    const existingUser = await userInfoModel.findById(req.params.id);
    if (!existingUser) throw new Error("User not found");

    // Skip if email didn't change
    if (existingUser.email === email) return true;
  }

  // Check if email exists in any other user
  const emailExists = await userInfoModel.findOne({ email });
  if (emailExists) throw new Error("Email already exists");

  return true;
};

export const userInfoValidator = checkSchema({
  firstName: {
    in: ["body"],
    notEmpty: { errorMessage: "First name is required" },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Only letters and spaces are allowed.",
    },
    trim: true,
  },
  lastName: {
    in: ["body"],
    notEmpty: { errorMessage: "Last name is required" },
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Only letters and spaces are allowed.",
    },
    trim: true,
  },
  gender: {
    in: ["body"],
    notEmpty: { errorMessage: "Gender is required" },
    isIn: {
      options: [["M", "F", "Other"]],
      errorMessage: "Gender must be M, F, or Other.",
    },
  },
  dateOfBirth: {
    in: ["body"],
    notEmpty: { errorMessage: "Date of birth is required" },
    isISO8601: {
      options: { strict: true },
      errorMessage: "Date of Birth must be a valid ISO 8601 date (YYYY-MM-DD).",
    },
  },
  maritalStatus: {
    in: ["body"],
    notEmpty: { errorMessage: "Marital status is required" },
    isIn: {
      options: [["Single", "Married", "Divorced", "Widowed", "Other"]],
      errorMessage:
        "Marital status must be one of: Single, Married, Divorced, Widowed, Other",
    },
  },
  occupation: {
    in: ["body"],
    optional: true, // Assuming this is optional
    matches: {
      options: [/^[A-Za-z\s]+$/],
      errorMessage: "Occupation Only letters and spaces are allowed.",
    },
    trim: true,
  },
  address: {
    in: ["body"],
    optional: true, // Assuming this is optional
    trim: true,
  },
  phoneNumber: {
    in: ["body"],
    isString: { errorMessage: "Phone Number must be a string." },
    matches: {
      options: [/^(\+?\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{3}[\s-]?\d{3,4}$/],
      errorMessage:
        "Invalid phone number format. Allowed formats include: xxx-xxx-xxx, xxx-xxx-xxxx, xxxxxxxxx, xxxxxxxxxx, (+xxx) xxx-xxx, (+xxx) xxx-xxxx, +x (xxx) xxx-xxx, +x (xxx) xxx-xxxx",
    },
  },
  email: {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
    custom: { options: emailUniqueValidator },
    trim: true,
    normalizeEmail: true, // optional, ensures normalized format
  },

  // --- Nested Array Fields Validation (using dot notation and wildcards) ---

  identifications: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "Identifications must be an array.",
    },
    // You might add options to check if the array is not empty
  },

  // Use '.*' to validate fields within every object in the identifications array
  "identifications.*.cardType": {
    in: ["body"],
    optional: true,
    trim: true,
  },
  "identifications.*.cardCode": {
    in: ["body"],
    optional: true,
    trim: true,
  },
});
