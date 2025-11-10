import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import UserInfo from "../models/user.info.model.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import { errorResponse, successResponse } from "../utils/response.handler.js";
import AccessToken from "../models/token.model.js";
import refreshToken from "../models/refresh.token.model.js";

// Full User Profile Creation
export const createUser = asyncHandler(async (req, res) => {
  try {
    const { username, password, fullName, roleId } = req.body;
    const branchId = req.body.branchId || null;
    const userInfoData = req.body.userInfo || null;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return successResponse(res, 400, "User already exists", []);
    }

    if (userInfoData == null) {
      return successResponse(res, 400, "User info is required", []);
    }

    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      maritalStatus,
      occupation,
    } = userInfoData;

    const address = userInfoData.address || "";
    const phoneNumber = userInfoData.phoneNumber || "";
    const email = userInfoData.email || "";
    const identifications = userInfoData.identifications || [];

    // Create UserInfo document
    const userInfo = await UserInfo.create({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      maritalStatus,
      occupation,
      address,
      phoneNumber,
      email,
      identifications,
    });

    const userInfoId = userInfo._id;

    // Create User document with reference to UserInfo
    const user = await User.create({
      username,
      password,
      fullName,
      roleId,
      branchId,
      userInfoId,
    });

    // Generate access token and refresh token for new user
    const createAccessToken = generateAccessToken(user._id);
    const createRefreshToken = generateRefreshToken(user._id);

    // Save refresh token in database
    await refreshToken.create({ userId: user._id, token: createRefreshToken });
    // Save access token in database
    await AccessToken.create({ userId: user._id, token: createAccessToken });

    // 4️⃣ Populate UserInfo before sending response
    const userObj = await User.findById(user._id)
      .populate("userInfoId")
      .populate("roleId")
      // .populate("branchId")
      .lean();

    delete userObj.__v;
    if (userObj.userInfoId) {
      delete userObj.userInfoId.__v;
    }

    const userData = {
      user: userObj,
      token: createAccessToken,
    };

    return successResponse(res, 201, "User created successfully", userData);
  } catch (error) {
    errorResponse(
      res,
      500,
      "Failed to create user and user info",
      error.message
    );
  }
});

// CRUD
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || process.env.DEFAULT_PAGE_SIZE;
    // const offset = parseInt(req.query.offset) || process.env.DEFAULT_RES_OFFSET;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // let { populate, branchId, select, search, startDate, endDate } = req.query;
    const {
      populate,
      search,
      gender,
      maritalStatus,
      cardType,
      cardCode,
      idSearch,
      startDate,
      endDate,
      branchId,
      select,
      sort,
    } = req.query;

    // Build filter
    const filter = { deleted: false };

    // Search in basic fields
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Marital status filter
    if (maritalStatus) {
      filter.maritalStatus = maritalStatus;
    }

    if (branchId) filter.branchId = branchId;

    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sortOptions = {};
    if (sort) {
      // The format from the image is 'field:asc,field:desc'
      // Mongoose's sort() expects an object like { field: 'asc' } or { field: -1 }

      sort.split(",").forEach((sortParam) => {
        const [field, direction] = sortParam.split(":").map((s) => s.trim());
        if (field && direction) {
          // Mongoose accepts 'asc', 'desc', 1, or -1
          sortOptions[field] = direction === "asc" ? 1 : -1;
        }
      });
      // query = query.sort(sortOptions);
    } else {
      // Default sort if none is provided
      sortOptions = { createdAt: -1 };
    }

    // ✅ Identification filtering
    if (cardType) filter["identifications.cardType"] = cardType;
    if (cardCode) filter["identifications.cardCode"] = cardCode;
    // ✅ Search inside identifications
    if (idSearch) {
      filter.$or = [
        ...(filter.$or || []),
        {
          "identifications.cardType": {
            $regex: idSearch,
            $options: "i",
          },
        },
        {
          "identifications.cardCode": {
            $regex: idSearch,
            $options: "i",
          },
        },
      ];
    }

    // // Query
    let query = UserInfo.find(filter).sort(sortOptions).skip(skip).limit(limit);

    // Select
    if (select) query = query.select(select.split(",").join(" "));

    // Populate
    // if (populate) {
    //   const populatedFields = [];
    //   populate.split(",").forEach((field) => {
    //     // query = query.populate(field.trim());
    //     populatedFields.push({ path: field.trim(), option: { lean: true } });
    //   });
    //   query = query.populate(populatedFields);
    // }

    // ✅ Populate from User schema
    if (populate) {
      const fields = populate.split(",").map((f) => f.trim());
      query = query.setOptions({ strictPopulate: false });
      fields.forEach((field) => query.populate(field));
    }

    const persons = await query.lean({ virtuals: true });
    const total = await UserInfo.countDocuments(filter);

    const userData = {
      total: total,
      page: page,
      pageSize: persons.length,
      users: total > 0 ? persons : [],
    };

    return successResponse(res, 200, "data get successfully", userData);
  } catch (error) {
    errorResponse(res, 500, "Failed to get user info", error.message);
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("roleId");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});
