const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	thumbnail: { type: String, default: "/path/to/default-thumbnail.jpg" },
	videoPath: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", videoSchema);
