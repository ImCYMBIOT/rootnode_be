const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { setupWebSocket } = require("./routes/wsRoutes");
const repoRoutes = require("./routes/repoRoutes");
const authRoutes = require("./auth/auth");
const streamRoutes = require("./routes/streamRoutes");
const contributorRoutes = require("./routes/contributorRoutes");
const learnRoutes = require("./routes/learnRoutes");
const fileRoute = require("./routes/fileRoute");

// Constants
const PORT = process.env.PORT || 3000;
const repositoriesDir = path.join(__dirname, "repositories");
const uploadsDir = path.join(__dirname, "uploads");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Ensure required directories exist
[repositoriesDir, uploadsDir, path.join(uploadsDir, "videos"), path.join(uploadsDir, "articles")].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Range"],
  exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
  credentials: true
}));

// Security headers with video streaming support
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      mediaSrc: ["'self'", "blob:", "data:"],
      imgSrc: ["'self'", "blob:", "data:"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:3000", "http://localhost:5173"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with proper headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, filePath) => {
    // Set appropriate headers based on file type
    if (filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg')) {
      res.set({
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      });
    } else if (filePath.endsWith('.pdf')) {
      res.set({
        'Content-Type': 'application/pdf',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      });
    } else if (filePath.endsWith('.doc') || filePath.endsWith('.docx')) {
      res.set({
        'Content-Type': 'application/msword',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      });
    }
    // Enable partial content and caching
    res.set({
      "Cache-Control": "public, max-age=3600",
    });
  },
}));

// WebSocket setup
const wss = setupWebSocket(server, repositoriesDir);

// API Routes
app.use("/repo", repoRoutes(repositoriesDir, wss));
app.use("/auth", authRoutes);
app.use("/stream", streamRoutes);
app.use("/contribute", contributorRoutes);
app.use("/learn", learnRoutes);
app.use("/files", fileRoute);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 RootNode backend is up and running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
server
  .listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("❌ Failed to start server:", err);
  });
