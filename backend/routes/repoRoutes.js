const express = require("express");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");
const chokidar = require("chokidar");
const Repo = require("../models/repoModel");

module.exports = (repositoriesDir, wss) => {
  const router = express.Router();

  // 📌 Create a new repository
  router.post("/create", async (req, res) => {
    const { repoName, uuid, description } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "User UUID is required" });
    }

    const repoPath = path.join(repositoriesDir, uuid, repoName);

    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    try {
      fs.mkdirSync(repoPath, { recursive: true });
      const git = simpleGit(repoPath);
      await git.init();

      const newRepo = new Repo({ name: repoName, uuid, description });
      await newRepo.save();

      watchRepository(repoPath, repoName, uuid, wss);

      res.status(201).json({
        message: "Repository created",
        repoName,
        uuid,
        description,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to create repository",
        error: err.message,
      });
    }
  });

  // 📌 Get all repositories for a user
  router.get("/user/:uuid/repos", async (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: "User UUID is required" });
    }

    try {
      const repos = await Repo.find({ uuid });

      if (!repos || repos.length === 0) {
        return res
          .status(404)
          .json({ message: "No repositories found for this user" });
      }

      res.json(repos);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch repositories",
        error: err.message,
      });
    }
  });

  // 📌 Commit changes
  router.post("/commit", async (req, res) => {
    const { repoName, uuid, commitMessage } = req.body;

    if (!uuid || !repoName || !commitMessage) {
      return res.status(400).json({
        message: "UUID, repoName, and commitMessage are required",
      });
    }

    const repoPath = path.join(repositoriesDir, uuid, repoName);

    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const git = simpleGit(repoPath);

    try {
      await git.add("./*");
      await git.commit(commitMessage);

      broadcast(wss, { repoName, message: `Commit: ${commitMessage}` });

      res.json({ message: "Changes committed", repoName, commitMessage });
    } catch (error) {
      res.status(500).json({ message: "Commit failed", error: error.message });
    }
  });

  // 📌 Delete a repository using repoId
  router.delete("/delete/:repoId", async (req, res) => {
    const { repoId } = req.params; // Use params instead of req.body

    if (!repoId) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    try {
      const repo = await Repo.findById(repoId);

      if (!repo) {
        return res.status(404).json({ message: "Repository not found" });
      }

      const repoPath = path.join(repositoriesDir, repo.uuid, repo.name);

      try {
        if (fs.existsSync(repoPath)) {
          await fs.promises.rm(repoPath, { recursive: true, force: true });
          console.log(`🗑️ Repository folder deleted: ${repoPath}`);
        }
      } catch (fsErr) {
        console.error("❌ Failed to delete repository folder:", fsErr.message);
      }

      await Repo.findByIdAndDelete(repoId);

      res.json({
        message: "Repository deleted successfully",
        repoId,
        repoName: repo.name,
        uuid: repo.uuid,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete repository",
        error: error.message,
      });
    }
  });

  return router;
};

// ✅ Watch repository for changes
function watchRepository(repoPath, repoName, uuid, wss) {
  if (!fs.existsSync(repoPath)) {
    console.error(`Cannot watch: Repository ${repoName} does not exist.`);
    return;
  }

  const watcher = chokidar.watch(repoPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event, filePath) => {
    console.log(`🔄 Change detected: ${event} on ${filePath}`);

    // Stop if repoPath is deleted
    if (!fs.existsSync(repoPath)) {
      console.warn(`🛑 Skipping auto commit: ${repoPath} no longer exists`);
      watcher.unwatch(repoPath); // Optional: stop watching
      return;
    }

    try {
      const git = simpleGit(repoPath);
      await git.add("./*");
      await git.commit(`Auto commit by ${uuid} at ${new Date().toISOString()}`);

      console.log(`✅ Auto commit successful for ${repoName}`);
      broadcast(wss, { repoName, event: "repo_updated", filePath });
    } catch (err) {
      console.error("❌ Auto commit failed:", err.message);
    }
  });

  console.log(`👀 Watching repository: ${repoName}`);
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
