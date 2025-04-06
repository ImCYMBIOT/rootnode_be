const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoPath: {
    type: String,
    required: true,
  },
  isExternalUrl: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  schema: videoSchema,
  model: mongoose.model("Video", videoSchema),
};
