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
const fileRoutes = require("./routes/fileTreeRoute");
const fsRoutes = require("./routes/fsRoutes");

// Constants
const PORT = process.env.PORT || 3000;
const repositoriesDir = path.join(__dirname, "repositories");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Ensure repositories directory exists
if (!fs.existsSync(repositoriesDir)) {
  fs.mkdirSync(repositoriesDir, { recursive: true });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Adds secure headers automatically

// Custom Content Security Policy (can be merged with helmet’s config)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws:;"
  );
  next();
});

// WebSocket setup
const wss = setupWebSocket(server, repositoriesDir);

// API Routes
app.use("/repo", repoRoutes(repositoriesDir, wss));
app.use("/auth", authRoutes);
app.use("/stream", streamRoutes);
app.use("/contribute", contributorRoutes);
app.use("/learn", learnRoutes);
app.use("/files", fileRoutes);
app.use("/fs", fsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 RootNode backend is up and running!");
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
