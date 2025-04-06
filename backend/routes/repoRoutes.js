const express = require("express");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");
const Repo = require("../models/repoModel");
const chokidar = require("chokidar");
const Files = require("../models/filesModel"); // import Files model at top if not already

module.exports = (repositoriesDir, wss) => {
  const router = express.Router();

  // 📌 Create a new repository (folder name = repoId)
  router.post("/create", async (req, res) => {
    const { repoName, uuid, description } = req.body;

    if (!uuid)
      return res.status(400).json({ message: "User UUID is required" });

    try {
      const existingRepo = await Repo.findOne({ name: repoName, uuid });
      if (existingRepo) {
        return res.status(409).json({
          message:
            "Repository with the same name already exists for this user.",
        });
      }

      const newRepo = new Repo({ name: repoName, uuid, description });
      await newRepo.save();

      const repoPath = path.join(repositoriesDir, uuid, newRepo._id.toString());

      if (fs.existsSync(repoPath)) {
        return res
          .status(400)
          .json({ message: "Repository folder already exists" });
      }

      fs.mkdirSync(repoPath, { recursive: true });
      const git = simpleGit(repoPath);
      await git.init();

      // ✅ Default empty file tree
      const initialTree = {
        name: "root",
        type: "folder",
        path: "/",
        children: [],
      };

      // ✅ Save to Files collection (used by file APIs)
      const fileStructure = new Files({
        _id: newRepo._id,
        owner: uuid,
        name: repoName,
        tree: initialTree,
      });

      await fileStructure.save();

      watchRepository(repoPath, newRepo._id.toString(), uuid, wss);

      res.status(201).json({
        message: "Repository created",
        repoId: newRepo._id,
        repoName,
        uuid,
        description,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Repository already exists with this name for the user.",
        });
      }
      res
        .status(500)
        .json({ message: "Failed to create repository", error: err.message });
    }
  });

  // 📌 Commit changes using repoId
  router.post("/commit", async (req, res) => {
    const { repoId, uuid, commitMessage } = req.body;

    if (!uuid || !repoId || !commitMessage) {
      return res
        .status(400)
        .json({ message: "UUID, repoId, and commitMessage are required" });
    }

    const repoPath = path.join(repositoriesDir, uuid, repoId);

    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const git = simpleGit(repoPath);

    try {
      await git.add("./*");
      await git.commit(commitMessage);

      broadcast(wss, { repoId, message: `Commit: ${commitMessage}` });

      res.json({ message: "Changes committed", repoId, commitMessage });
    } catch (error) {
      res.status(500).json({ message: "Commit failed", error: error.message });
    }
  });

  // 📌 Delete a repository using repoId
  router.delete("/delete/:repoId", async (req, res) => {
    const { repoId } = req.params;

    if (!repoId)
      return res.status(400).json({ message: "Repository ID is required" });

    try {
      const repo = await Repo.findById(repoId);

      if (!repo)
        return res.status(404).json({ message: "Repository not found" });

      const repoPath = path.join(repositoriesDir, repo.uuid, repoId);

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
      res
        .status(500)
        .json({ message: "Failed to delete repository", error: error.message });
    }
  });

  // 📜 Get all repositories for a user
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
      res
        .status(500)
        .json({ message: "Failed to fetch repositories", error: err.message });
    }
  });

  return router;
};

// 👁️ Watch repo folder for changes
function watchRepository(repoPath, repoId, uuid, wss) {
  if (!fs.existsSync(repoPath)) {
    console.error(`Cannot watch: Repository ${repoId} does not exist.`);
    return;
  }

  const watcher = chokidar.watch(repoPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event, filePath) => {
    console.log(`🔄 Change detected: ${event} on ${filePath}`);

    if (!fs.existsSync(repoPath)) {
      console.warn(`🛑 Skipping auto commit: ${repoPath} no longer exists`);
      watcher.unwatch(repoPath);
      return;
    }

    try {
      const git = simpleGit(repoPath);
      await git.add("./*");
      await git.commit(`Auto commit by ${uuid} at ${new Date().toISOString()}`);

      console.log(`✅ Auto commit successful for repo ${repoId}`);
      broadcast(wss, { repoId, event: "repo_updated", filePath });
    } catch (err) {
      console.error("❌ Auto commit failed:", err.message);
    }
  });

  console.log(`👀 Watching repository: ${repoId}`);
}

// 📡 Broadcast to connected WebSocket clients
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
