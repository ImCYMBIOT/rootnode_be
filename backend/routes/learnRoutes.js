const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith("video/") ? "uploads/videos" : "uploads/articles";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// MongoDB Models
const videoSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  thumbnail: String,
  video_id: String,
  videoPath: String,
  created_at: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema({
  title: String,
  short_description: String,
  author: String,
  filePath: String,
  created_at: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);
const Article = mongoose.model("Article", articleSchema);

// Create a new Video
router.post("/videos", upload.single("file"), async (req, res) => {
  try {
    const { title, author, description, thumbnail, video_id } = req.body;
    const video = new Video({
      title,
      author,
      description,
      thumbnail,
      video_id,
      videoPath: req.file.path,
    });
    const saved = await video.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ created_at: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Create a new Article
router.post("/articles", upload.single("file"), async (req, res) => {
  try {
    const { title, author, short_description } = req.body;
    const article = new Article({
      title,
      author,
      short_description,
      filePath: req.file.path,
    });
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Article upload error:", err);
    res.status(500).json({ error: "Failed to upload article" });
  }
});

// Get all articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ created_at: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

module.exports = router;
