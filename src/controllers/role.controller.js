import asyncHandler from "express-async-handler";
import Role from "../models/role.model.js";
import { errorResponse, successResponse } from "../utils/response.handler.js";

export const createRole = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const actions = req.body.actions || [];
    const role = await Role.create({ name, description, actions });
    const roleObj = role.toObject();
    delete roleObj.__v;
    delete roleObj._id;
    return successResponse(res, 201, "Role created successfully", roleObj);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", error.message);
  }
});

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().populate("actions");
  res.json(roles);
});

export const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).populate("actions");
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }
  res.json(role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role deleted" });
});
