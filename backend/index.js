const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { setupWebSocket } = require("./routes/wsRoutes");
const repoRoutes = require("./routes/repoRoutes");

const app = express();
const server = http.createServer(app);
const repositoriesDir = path.join(__dirname, "repositories");

// Ensure repositories directory exists
if (!fs.existsSync(repositoriesDir)) {
  fs.mkdirSync(repositoriesDir);
}

// Set Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws:;"
  );
  next();
});

// Middleware
app.use(express.json());

// ✅ Initialize WebSocket and get `wss`
const wss = setupWebSocket(server, repositoriesDir);

// ✅ Pass `wss` to `repoRoutes`
app.use("/repo", repoRoutes(repositoriesDir, wss));

// Start server
server
  .listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
