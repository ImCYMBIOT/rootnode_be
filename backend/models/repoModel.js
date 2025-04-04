const mongoose = require("mongoose");

const RepoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uuid: { type: String, required: true }, // User's UUID
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Repo", RepoSchema);
