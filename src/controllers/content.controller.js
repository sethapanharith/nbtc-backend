import { ContentModel } from "../models/content.model.js";

/**
 * Create Content
 */
export const createContent = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.user._id;
    const content = await ContentModel.create(data);
    const populatedContent = await ContentModel.findById(content._id)
      .populate({
        path: "createdBy",
        select: "username fullName",
      })
      .lean();

    delete populatedContent.__v;
    return successResponse(
      res,
      201,
      "Content created successfully",
      populatedContent
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Content
 */
export const getContents = async (req, res, next) => {
  try {
    const contents = await Content.find({ deleted: false })
      .sort({ sort: 1 })
      .populate("createdBy updatedBy", "fullName username");

    return res.status(200).json({
      message: "Content list",
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Content By ID
 */
export const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id).populate(
      "createdBy updatedBy",
      "fullName username"
    );

    if (!content || content.deleted)
      return res.status(404).json({ message: "Content not found" });

    return res.status(200).json({
      message: "Content detail",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Content
 */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content || content.deleted)
      return res.status(404).json({ message: "Content not found" });

    Object.assign(content, req.body);
    content.updatedBy = req.user._id;

    await content.save();

    return res.status(200).json({
      message: "Content updated successfully",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft Delete Content
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content || content.deleted)
      return res.status(404).json({ message: "Content not found" });

    content.deleted = true;
    content.updatedBy = req.user._id;
    content.updatedAt = new Date();

    await content.save();

    return res.status(200).json({
      message: "Content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
