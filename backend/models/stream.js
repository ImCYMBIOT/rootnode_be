const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  uuid: { type: String, required: true }, // User's UUID
  username: { type: String, required: true }, // Optional: Username of the streamer
  title: { type: String, required: true }, // Stream title
  description: { type: String }, // Optional description
  isLive: { type: Boolean, default: true }, // Stream status
  createdAt: { type: Date, default: Date.now }, // Start time
});

module.exports = mongoose.model("Stream", StreamSchema);
