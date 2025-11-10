import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";
import { errorResponse, successResponse } from "../utils/response.handler.js";
import AccessToken from "../models/token.model.js";
import refreshToken from "../models/refresh.token.model.js";

// Login
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("roleId");

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return successResponse(res, 403, "Invalid credentials", []);
      }

      // Generate access token and refresh token for new user
      const createAccessToken = generateAccessToken(user._id);
      const createRefreshToken = generateRefreshToken(user._id);

      // Save refresh token in database
      await refreshToken.create({
        userId: user._id,
        token: createRefreshToken,
      });
      // Save access token in database
      await AccessToken.create({ userId: user._id, token: createAccessToken });

      const userData = {
        user: {
          username: user.username,
          fullName: user.fullName,
          roleId: user.roleId,
        },
        token: createAccessToken,
      };

      return successResponse(res, 200, "Login successfully", userData);
    } else {
      return successResponse(res, 401, "Invalid credentials", []);
    }
  } catch (error) {
    return errorResponse(res, 500, "Failed to login user", error.message);
  }
});

// Register
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, password, fullName, roleId } = req.body;
    const branchId = req.body.branchId || null;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return successResponse(res, 400, "User already exists", []);
    }

    const user = await User.create({
      username,
      password,
      fullName,
      roleId,
      branchId,
    });

    // Generate access token and refresh token for new user
    const createAccessToken = generateAccessToken(user._id);
    const createRefreshToken = generateRefreshToken(user._id);

    // Save refresh token in database
    await refreshToken.create({ userId: user._id, token: createRefreshToken });
    // Save access token in database
    await AccessToken.create({ userId: user._id, token: createAccessToken });

    const userObj = {
      user: {
        username: user.username,
        fullName: user.fullName,
      },
      token: createAccessToken,
    };

    return successResponse(res, 201, "User created successfully.", userObj);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error.message);
  }
});

// Profile
export const me = asyncHandler(async (req, res) => {
  try {
    const reqUser = req.user;
    const user = await User.findById(reqUser._id).populate([
      "userInfoId",
      "branchId",
      "roleId",
    ]);
    if (!user) {
      return successResponse(res, 404, "User not found.", []);
    }

    const userInfo = user.toObject({ virtuals: true });

    delete userInfo.password;
    delete userInfo.__v;
    if (userInfo.id) delete userInfo.id;

    if (userInfo.userInfoId) {
      delete userInfo.userInfoId.__v;
      delete userInfo.userInfoId.deleted;
      if (userInfo.userInfoId.id) delete userInfo.userInfoId.id;
    }

    return successResponse(
      res,
      200,
      "User profile get successfully.",
      userInfo
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error.message);
  }
});

// export const me = asyncHandler(async (req, res) => {
//   try {
//     const reqUser = req.user;
//     const user = await User.findById(reqUser._id)
//       .populate([
//         { path: "userInfoId", option: { lean: { virtuals: true } } },
//         { path: "roleId", option: { lean: true } },
//       ])
//       .lean({ virtuals: true });
//     if (!user) {
//       return successResponse(res, 404, "User not found.", []);
//     }

//     delete user.password;
//     delete user.__v;

//     if (user.userInfoId) {
//       delete user.userInfoId.__v;
//       delete user.userInfoId.deleted;
//     }

//     // const userInfo = user.toObject();
//     // delete userInfo.password;
//     // delete userInfo.__v;
//     // delete userInfo.userInfoId.__v;
//     // delete userInfo.userInfoId.deleted;

//     return successResponse(res, 200, "User profile get successfully.", user);
//   } catch (error) {
//     return errorResponse(res, 500, "Internal server error", error.message);
//   }
// });
