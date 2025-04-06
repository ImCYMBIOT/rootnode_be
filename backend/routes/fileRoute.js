const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Files = require("../models/filesModel");

const repositoriesDir = path.join(__dirname, "..", "repositories");

const {
  insertNode,
  updateNodeContent,
  deleteNode,
  findNodeByPath,
  renameNodeAndPaths,
} = require("../services/filesHelper");

// Utility: get full repo path
const getFullPath = (uuid, repoId, relativePath = "") =>
  path.join(repositoriesDir, uuid, repoId, relativePath);

/** --- FILE TREE BASED OPERATIONS --- **/

// Get file tree by repoId
router.get("/:id", async (req, res) => {
  try {
    const fileTree = await Files.findById(req.params.id);
    if (!fileTree)
      return res.status(404).json({ error: "File structure not found" });
    res.status(200).json(fileTree.tree);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get file tree by user uuid and repoId
router.get("/user/:uuid/repo/:repoId", async (req, res) => {
  const { uuid, repoId } = req.params;

  try {
    const repo = await Files.findById(repoId);
    if (!repo || repo.owner !== uuid) {
      return res
        .status(404)
        .json({ message: "Repository not found for this user" });
    }

    res.status(200).json(repo.tree);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add file to tree
router.post("/:repoId/add-file", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, fileName, content = "" } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const fullPath = path.join(parentPath, fileName);
    const existing = findNodeByPath(repo.tree, fullPath);
    if (existing)
      return res.status(409).json({ message: "File already exists" });

    const newNode = {
      name: fileName,
      type: "file",
      path: fullPath,
      content,
      children: [],
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success)
      return res.status(400).json({ message: "Parent path not found" });

    await repo.save();
    res
      .status(201)
      .json({ message: "File added", file: newNode, tree: repo.tree });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// Add folder to tree
router.post("/:repoId/add-folder", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, folderName } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const fullPath = path.join(parentPath, folderName);
    const existing = findNodeByPath(repo.tree, fullPath);
    if (existing)
      return res.status(409).json({ message: "Folder already exists" });

    const newNode = {
      name: folderName,
      type: "folder",
      path: fullPath,
      content: "",
      children: [],
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success)
      return res.status(400).json({ message: "Parent path not found" });

    await repo.save();
    res
      .status(201)
      .json({ message: "Folder added", folder: newNode, tree: repo.tree });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// Update file content in tree
router.patch("/:repoId/update-content", async (req, res) => {
  const { repoId } = req.params;
  const { filePath, newContent } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const updated = updateNodeContent(repo.tree, filePath, newContent);
    if (!updated) return res.status(404).json({ message: "File not found" });

    await repo.save();
    res.json({ message: "File content updated", filePath });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// Delete file or folder from tree
router.delete("/:repoId/delete-file", async (req, res) => {
  const { repoId } = req.params;
  const { targetPath } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const deleted = deleteNode(repo.tree, targetPath, "file");
    if (!deleted) return res.status(404).json({ message: "File not found" });

    await repo.save();
    res.json({ message: "File deleted", path: targetPath });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

router.delete("/:repoId/delete-folder", async (req, res) => {
  const { repoId } = req.params;
  const { targetPath } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const deleted = deleteNode(repo.tree, targetPath, "folder");
    if (!deleted) return res.status(404).json({ message: "Folder not found" });

    await repo.save();
    res.json({ message: "Folder deleted", path: targetPath });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// Rename file/folder
router.patch("/:repoId/rename-node", async (req, res) => {
  const { repoId } = req.params;
  const { oldPath, newName } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const updated = renameNodeAndPaths(repo.tree, oldPath, newName);
    if (!updated) return res.status(404).json({ message: "Node not found" });

    await repo.save();
    res.json({ message: "Node renamed", newPath: updated.newPath });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

// Get in-memory file content from tree
router.get("/:repoId/file-content", async (req, res) => {
  const { repoId } = req.params;
  const { filePath } = req.query;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const fileNode = findNodeByPath(repo.tree, filePath);
    if (!fileNode || fileNode.type !== "file") {
      return res
        .status(404)
        .json({ message: "File not found or invalid path" });
    }

    res.status(200).json({ content: fileNode.content });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
});

/** --- PHYSICAL FILESYSTEM OPERATIONS --- **/

// Read file from disk
router.get("/:repoId/open-file", async (req, res) => {
  const { repoId } = req.params;
  const { uuid, filePath: relativePath } = req.query;

  if (!uuid || !relativePath)
    return res.status(400).json({ message: "UUID and filePath required" });

  const absPath = getFullPath(uuid, repoId, relativePath);
  if (!fs.existsSync(absPath))
    return res.status(404).json({ message: "File does not exist" });

  try {
    const content = await fs.promises.readFile(absPath, "utf-8");
    res.json({ content });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to read file", error: err.message });
  }
});

// Create file on disk
router.post("/create-file", async (req, res) => {
  const { uuid, repoId, relativePath, content = "" } = req.body;
  const filePath = getFullPath(uuid, repoId, relativePath);

  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, content);
    res.status(201).json({ message: "File created", path: filePath });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create file", details: err.message });
  }
});

// Create folder on disk
router.post("/create-folder", async (req, res) => {
  const { uuid, repoId, relativePath } = req.body;
  const dirPath = getFullPath(uuid, repoId, relativePath);

  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    res.status(201).json({ message: "Folder created", path: dirPath });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create folder", details: err.message });
  }
});

// Update file content on disk
router.patch("/update-file", async (req, res) => {
  const { uuid, repoId, relativePath, content } = req.body;
  const filePath = getFullPath(uuid, repoId, relativePath);

  try {
    await fs.promises.writeFile(filePath, content);
    res.json({ message: "File updated", path: filePath });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update file", details: err.message });
  }
});

// Delete file/folder on disk
router.delete("/delete", async (req, res) => {
  const { uuid, repoId, relativePath } = req.body;
  const targetPath = getFullPath(uuid, repoId, relativePath);

  try {
    const stats = await fs.promises.stat(targetPath);
    if (stats.isDirectory()) {
      await fs.promises.rm(targetPath, { recursive: true, force: true });
    } else {
      await fs.promises.unlink(targetPath);
    }

    res.json({ message: "Deleted", path: targetPath });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete", details: err.message });
  }
});

module.exports = router;
