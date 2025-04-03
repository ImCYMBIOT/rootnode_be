const express = require("express");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");

module.exports = (repositoriesDir, wss) => {
  const router = express.Router();

  // Create a new repository
  router.post("/create", async (req, res) => {
    const { repoName } = req.body;
    const repoPath = path.join(repositoriesDir, repoName);

    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    fs.mkdirSync(repoPath);
    const git = simpleGit(repoPath);
    await git.init();
    res.json({ message: "Repository created", repoName });

    watchRepository(repositoriesDir, repoName, wss); // ✅ Pass wss
  });

  // Commit changes
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

// ✅ Fix: Accept `wss` as an additional parameter
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
          broadcast(wss, { repoName, changes: { file: filename, content } }); // ✅ Now `wss` is available
        }
      });
    }
  });

  console.log(`Watching repository: ${repoName}`);
}

// Broadcast to all WebSocket clients
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
