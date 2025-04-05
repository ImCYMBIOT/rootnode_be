const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Article = require("../models/Article");
const Video = require("../models/Video");

// Temporary multer storage for initial upload
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: tempStorage });

// -------------------- VIDEO ROUTES --------------------

// Create new video
router.post("/videos", upload.single("file"), async (req, res) => {
  try {
    const { title, author, description } = req.body;

    // Create video in DB first to get the Mongo _id
    const newVideo = new Video({
      title,
      author,
      description,
      thumbnail: "/path/to/default-thumbnail.jpg", // You can update this
      videoPath: "", // Placeholder for now
    });

    const savedVideo = await newVideo.save();

    // Define new filename using MongoDB _id
    const ext = path.extname(req.file.originalname);
    const newFileName = `${savedVideo._id}${ext}`;
    const finalVideoPath = path.join("Videos", newFileName);

    // Ensure Videos directory exists
    const videosDir = path.join(__dirname, "..", "Videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    // Move file from temp to Videos/ folder
    fs.renameSync(req.file.path, path.join(videosDir, newFileName));

    // Update videoPath in DB
    savedVideo.videoPath = finalVideoPath;
    await savedVideo.save();

    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ created_at: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
});

// -------------------- ARTICLE ROUTES --------------------

// Create new article
router.post("/articles", upload.single("file"), async (req, res) => {
  try {
    const { title, author, description } = req.body;

    // Ensure articles folder exists
    const articlesDir = path.join(__dirname, "..", "uploads", "articles");
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    const ext = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const newPath = path.join(articlesDir, fileName);

    // Move file from temp to articles folder
    fs.renameSync(req.file.path, newPath);

    const newArticle = new Article({
      title,
      author,
      description,
      filePath: path.join("uploads", "articles", fileName),
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "Error uploading article", error });
  }
});

// Get all articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
});

module.exports = router;
