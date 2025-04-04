const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  uuid: { type: String, required: true }, // User's UUID (who wrote the article)
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true }, // Author's name
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
