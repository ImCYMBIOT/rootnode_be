const express = require("express");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");
const Repo = require("../models/repoModel");

module.exports = (repositoriesDir, wss) => {
  const router = express.Router();

  // 📌 Create a new repository (with user UUID)
  router.post("/create", async (req, res) => {
    const { repoName, uuid } = req.body; // Ensure user UUID is provided
    if (!uuid)
      return res.status(400).json({ message: "User UUID is required" });

    const repoPath = path.join(repositoriesDir, repoName);

    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    try {
      fs.mkdirSync(repoPath);
      const git = simpleGit(repoPath);
      await git.init();

      // Store repo in MongoDB
      const newRepo = new Repo({ name: repoName, uuid });
      await newRepo.save();

      watchRepository(repositoriesDir, repoName, wss);
      res.json({ message: "Repository created", repoName, uuid });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create repository", error: err.message });
    }
  });

  // 📌 Get all repositories for a user
  router.get("/user/:uuid/repos", async (req, res) => {
    try {
      const { uuid } = req.params;
      const repos = await Repo.find({ uuid });
      res.json(repos);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch repositories", error: err.message });
    }
  });

  // 📌 Commit changes
  router.post("/commit", async (req, res) => {
    const { repoName, commitMessage } = req.body;
    const repoPath = path.join(repositoriesDir, repoName);

    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const git = simpleGit(repoPath);

    try {
      await git.add("./*");
      await git.commit(commitMessage);

      // Notify WebSocket clients
      broadcast(wss, { repoName, message: `Commit: ${commitMessage}` });

      res.json({ message: "Changes committed", repoName, commitMessage });
    } catch (error) {
      res.status(500).json({ message: "Commit failed", error: error.message });
    }
  });

  return router;
};

// ✅ Watch repository for changes
function watchRepository(repositoriesDir, repoName, wss) {
  const repoPath = path.join(repositoriesDir, repoName);

  if (!fs.existsSync(repoPath)) {
    console.error(`Cannot watch: Repository ${repoName} does not exist.`);
    return;
  }

  fs.watch(repoPath, { recursive: true }, (eventType, filename) => {
    if (filename) {
      const filePath = path.join(repoPath, filename);
      fs.readFile(filePath, "utf8", (err, content) => {
        if (!err) {
          console.log(`File changed: ${filename}`);
          broadcast(wss, { repoName, changes: { file: filename, content } });
        }
      });
    }
  });

  console.log(`Watching repository: ${repoName}`);
}

// ✅ Broadcast to WebSocket clients
function broadcast(wss, data) {
  if (!wss) {
    console.error("WebSocket server is not initialized!");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
