const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	filePath: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("article", articleSchema);
