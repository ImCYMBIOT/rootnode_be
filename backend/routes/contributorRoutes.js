// contributorRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");
const Repo = require("../models/repoModel");

module.exports = (repositoriesDir) => {
  const router = express.Router();

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

  // 📜 Get latest commits for a repository
  router.get("/repo/:repoId/commits", async (req, res) => {
    const { repoId } = req.params;
    const { limit = 10 } = req.query;

    try {
      const repo = await Repo.findById(repoId);
      if (!repo)
        return res.status(404).json({ message: "Repository not found" });

      const repoPath = path.join(repositoriesDir, repo.uuid, repo.name);
      const git = simpleGit(repoPath);

      const log = await git.log({ maxCount: parseInt(limit) });
      res.json(log.all);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch commits", error: error.message });
    }
  });

  // 📂 Get tree structure of a repository
  router.get("/repo/:repoId/tree", async (req, res) => {
    const { repoId } = req.params;

    try {
      const repo = await Repo.findById(repoId);
      if (!repo)
        return res.status(404).json({ message: "Repository not found" });

      const repoPath = path.join(repositoriesDir, repo.uuid, repo.name);

      const walk = (dir) => {
        return fs.readdirSync(dir).map((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          return {
            name: file,
            type: stat.isDirectory() ? "folder" : "file",
            children: stat.isDirectory() ? walk(filePath) : null,
          };
        });
      };

      const tree = walk(repoPath);
      res.json(tree);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to get repository tree", error: err.message });
    }
  });

  // 📄 Get file content by path
  router.get("/repo/:repoId/file", async (req, res) => {
    const { repoId } = req.params;
    const { path: filePathParam } = req.query;

    if (!filePathParam) {
      return res
        .status(400)
        .json({ message: "File path is required in query" });
    }

    try {
      const repo = await Repo.findById(repoId);
      if (!repo)
        return res.status(404).json({ message: "Repository not found" });

      const absPath = path.join(
        repositoriesDir,
        repo.uuid,
        repo.name,
        filePathParam
      );

      if (!fs.existsSync(absPath)) {
        return res.status(404).json({ message: "File not found" });
      }

      const content = fs.readFileSync(absPath, "utf-8");
      res.send(content);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to read file", error: err.message });
    }
  });

  // 🗃️ Optionally, return flat list of all files
  router.get("/repo/:repoId/files", async (req, res) => {
    const { repoId } = req.params;

    try {
      const repo = await Repo.findById(repoId);
      if (!repo)
        return res.status(404).json({ message: "Repository not found" });

      const repoPath = path.join(repositoriesDir, repo.uuid, repo.name);
      const allFiles = [];

      const walk = (dir, base = "") => {
        fs.readdirSync(dir).forEach((file) => {
          const filePath = path.join(dir, file);
          const relativePath = path.join(base, file);
          if (fs.statSync(filePath).isDirectory()) {
            walk(filePath, relativePath);
          } else {
            allFiles.push(relativePath);
          }
        });
      };

      walk(repoPath);
      res.json(allFiles);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to list files", error: err.message });
    }
  });

  return router;
};
