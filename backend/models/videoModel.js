const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  uuid: { type: String, required: true }, // User's UUID (who uploaded the video)
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true }, // Name of uploader
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" }, // File path for thumbnail
  videoPath: { type: String, required: true }, // Local file path of the video
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", VideoSchema);
