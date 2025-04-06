// routes/learnUploads.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure /uploads/videos exists
const videoDir = path.join(__dirname, "..", "uploads", "videos");
if (!fs.existsSync(videoDir)) {
	fs.mkdirSync(videoDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, videoDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `video_${Date.now()}${ext}`);
	},
});

const upload = multer({ storage });

// Upload route
router.post("/upload/video", upload.single("video"), (req, res) => {
	if (!req.file) return res.status(400).json({ message: "No file uploaded" });

	const filePath = `uploads/videos/${req.file.filename}`;
	res.status(200).json({ message: "Video uploaded successfully", path: filePath });
});

module.exports = router;
