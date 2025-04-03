const mongoose = require("mongoose");

const RepoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uuid: { type: String, required: true }, // User's UUID
});

module.exports = mongoose.model("Repo", RepoSchema);
