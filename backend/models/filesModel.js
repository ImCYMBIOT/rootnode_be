const mongoose = require("mongoose");
const TreeNodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    path: { type: String, required: true },
    content: { type: String, default: "" },
    children: [this],
  },
  { _id: false }
);

const FilesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // name of the project or folder root
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tree: TreeNodeSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Files = mongoose.model("Files", FilesSchema);

module.exports = Files;
