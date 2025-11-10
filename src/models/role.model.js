import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Action" }],
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
