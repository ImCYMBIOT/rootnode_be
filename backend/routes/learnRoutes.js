const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

// File type validation
const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
const allowedArticleTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

// Upload directories setup
const uploadDirs = {
  videos: path.join(__dirname, "..", "uploads", "videos"),
  articles: path.join(__dirname, "..", "uploads", "articles")
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "video" ? uploadDirs.videos : uploadDirs.articles;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid video file type. Allowed types: ${allowedVideoTypes.join(", ")}`), false);
    }
  } else if (file.fieldname === "article") {
    if (allowedArticleTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid article file type. Allowed types: ${allowedArticleTypes.join(", ")}`), false);
    }
  } else {
    cb(new Error("Invalid file field"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// MongoDB Models
const Video = mongoose.model("Video", require("../models/videoModel").schema);
const Article = mongoose.model("Article", require("../models/articleModel").schema);

// Create a new Video (supports both file upload and external URL)
router.post("/videos", upload.single("video"), async (req, res) => {
  try {
    const { title, author, description, videoUrl, thumbnail } = req.body;
    
    let videoData = {
      title,
      author,
      description,
      thumbnail: thumbnail || null
    };

    // Handle external URL
    if (videoUrl) {
      videoData.videoPath = videoUrl;
      videoData.isExternalUrl = true;
    } 
    // Handle file upload
    else if (req.file) {
      videoData.videoPath = req.file.path.replace(/\\/g, "/");
      videoData.isExternalUrl = false;
    } else {
      return res.status(400).json({ error: "Either video file or video URL is required" });
    }

    const video = new Video(videoData);
    const saved = await video.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Video creation error:", err);
    res.status(500).json({ error: err.message || "Failed to create video" });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ created_at: -1 });
    
    const videosWithUrls = videos.map(video => {
      const videoData = {
        ...video.toObject(),
        type: "Video",
      };

      // For external URLs, use the URL directly
      if (video.isExternalUrl) {
        videoData.videoUrl = video.videoPath;
      } else {
        // For local files, construct streaming URL
        videoData.videoUrl = `http://localhost:3000/learn/stream/${video._id}`;
      }

      return videoData;
    });
    
    res.json(videosWithUrls);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Stream video (only for local files)
router.get("/stream/:videoId", async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (video.isExternalUrl) {
      return res.redirect(video.videoPath);
    }

    const videoPath = path.resolve(video.videoPath);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: "Video file not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": `video/${path.extname(videoPath).slice(1)}`,
      };
      
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": `video/${path.extname(videoPath).slice(1)}`,
      };
      
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    console.error("Video streaming error:", err);
    res.status(500).json({ error: "Failed to stream video" });
  }
});

// Import test data
router.post("/import-test-data", async (req, res) => {
  try {
    // Read test data files
    const videosPath = path.join(__dirname, "..", "test.videos.json");
    const articlesPath = path.join(__dirname, "..", "test.articles.json");
    
    const videosData = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

    // Clear existing data
    await Video.deleteMany({});
    await Article.deleteMany({});

    // Import videos
    for (const videoData of videosData) {
      const video = new Video({
        title: videoData.title,
        author: videoData.author,
        description: videoData.description,
        videoPath: videoData.videoPath,
        thumbnail: videoData.thumbnail || null,
        isExternalUrl: true,
        _id: videoData._id.$oid
      });
      await video.save();
    }

    // Import articles
    for (const articleData of articlesData) {
      const article = new Article({
        title: articleData.title,
        author: articleData.author,
        description: articleData.description,
        filePath: articleData.filepath,
        _id: articleData._id.$oid
      });
      await article.save();
    }

    res.json({ message: "Test data imported successfully" });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: err.message || "Failed to import test data" });
  }
});

// Create a new Article
router.post("/articles", upload.single("article"), async (req, res) => {
  try {
    console.log("Received article upload request");
    
    if (!req.file) {
      console.log("No article file in request");
      return res.status(400).json({ error: "No article file uploaded" });
    }

    console.log("File details:", req.file);

    const { title, author, description } = req.body;
    const article = new Article({
      title,
      author,
      description,
      filePath: req.file.path.replace(/\\/g, "/"),
    });

    const saved = await article.save();
    console.log("Article saved successfully:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Article upload error:", err);
    res.status(500).json({ error: err.message || "Failed to upload article" });
  }
});

// Get all articles
router.get("/articles", async (req, res) => {
  try {
    console.log("Fetching articles");
    const articles = await Article.find().sort({ created_at: -1 });
    console.log(`Found ${articles.length} articles`);
    
    const articlesWithUrls = articles.map(article => {
      const articleData = {
        ...article.toObject(),
        type: "Article",
        downloadUrl: `http://localhost:3000/learn/article/${article._id}`
      };
      console.log("Article data:", articleData);
      return articleData;
    });
    
    res.json(articlesWithUrls);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Serve article file
router.get("/article/:articleId", async (req, res) => {
  try {
    console.log("Downloading article:", req.params.articleId);
    
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      console.log("Article not found:", req.params.articleId);
      return res.status(404).json({ error: "Article not found" });
    }

    const filePath = path.resolve(article.filePath);
    console.log("Article path:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log("Article file not found at path:", filePath);
      return res.status(404).json({ error: "Article file not found" });
    }

    res.download(filePath);
  } catch (err) {
    console.error("Article download error:", err);
    res.status(500).json({ error: "Failed to download article" });
  }
});

module.exports = router;
