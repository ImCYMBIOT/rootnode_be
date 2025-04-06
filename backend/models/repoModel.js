const mongoose = require("mongoose");

const RepoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uuid: { type: String, required: true }, // Owner's UUID
  description: { type: String, default: "" },
  visibility: { type: String, enum: ["public", "private"], default: "private" },
  language: { type: String, default: "" },
  contributors: [{ type: String }], // List of contributor UUIDs
  createdAt: { type: Date, default: Date.now },
});

// ✅ Ensure (name + uuid) is unique per user
RepoSchema.index({ name: 1, uuid: 1 }, { unique: true });

module.exports = mongoose.model("Repo", RepoSchema);
