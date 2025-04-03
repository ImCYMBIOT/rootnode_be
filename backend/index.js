const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const { setupWebSocket } = require("./routes/wsRoutes");
const repoRoutes = require("./routes/repoRoutes");
const authRoutes = require("./auth/auth");
require("dotenv").config();

// Initialize Express
const app = express();
const server = http.createServer(app);
const repositoriesDir = path.join(__dirname, "repositories");

// 📈 Connect to MongoDB using .env variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 📈 Ensure repositories directory exists
if (!fs.existsSync(repositoriesDir)) {
  fs.mkdirSync(repositoriesDir);
}

// 📈 Set security headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws:;"
  );
  next();
});

//  Middleware
app.use(cors()); // Allow CORS
app.use(express.json());

//  Initialize WebSocket and get `wss`
const wss = setupWebSocket(server, repositoriesDir);

//  Routes
app.use("/repo", repoRoutes(repositoriesDir, wss)); // Repository routes
app.use("/auth", authRoutes); // Authentication routes

// 📈 Start server
server
  .listen(3000, () => {
    console.log(" Server running on http://localhost:3000");
  })
  .on("error", (err) => {
    console.error(" Failed to start server:", err);
  });
