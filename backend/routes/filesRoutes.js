const express = require("express");
const router = express.Router();
const Files = require("../models/filesModel");
const path = require("path");
const repositoriesDir = path.join(__dirname, "..", "repositories");

const {
  insertNode,
  updateNodeContent,
  deleteNode,
  findNodeByPath,
  renameNodeAndPaths,
} = require("../services/filesHelper");

// GET /files/:id - Get file tree
router.get("/:id", async (req, res) => {
  try {
    const fileTree = await Files.findById(req.params.id);
    if (!fileTree)
      return res.status(404).json({ error: "File structure not found" });
    res.status(200).json(fileTree.tree);
  } catch (err) {
    console.error("Error fetching file structure:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching file structure" });
  }
});

// Add new file
router.post("/:repoId/add-file", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, fileName, content = "" } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const existing = findNodeByPath(repo.tree, path.join(parentPath, fileName));
    if (existing)
      return res
        .status(409)
        .json({ message: "File already exists at that location" });

    const newNode = {
      name: fileName,
      type: "file",
      path: path.join(parentPath, fileName),
      content,
      children: [],
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success)
      return res.status(400).json({ message: "Parent path not found" });

    await repo.save();
    res.status(201).json({
      message: "File added successfully",
      file: newNode,
      tree: repo.tree,
    });
  } catch (err) {
    console.error("❌ Error adding file:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Add new folder
router.post("/:repoId/add-folder", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, folderName } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const existing = findNodeByPath(
      repo.tree,
      path.join(parentPath, folderName)
    );
    if (existing)
      return res
        .status(409)
        .json({ message: "Folder already exists at that location" });

    const newNode = {
      name: folderName,
      type: "folder",
      path: path.join(parentPath, folderName),
      children: [],
      content: "",
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success)
      return res.status(400).json({ message: "Parent path not found" });

    await repo.save();
    res.status(201).json({
      message: "Folder added successfully",
      folder: newNode,
      tree: repo.tree,
    });
  } catch (err) {
    console.error("❌ Error adding folder:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Update file content
router.patch("/:repoId/update-content", async (req, res) => {
  const { repoId } = req.params;
  const { filePath, newContent } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const updated = updateNodeContent(repo.tree, filePath, newContent);
    if (!updated) return res.status(404).json({ message: "File not found" });

    await repo.save();
    res.json({ message: "File content updated successfully", filePath });
  } catch (err) {
    console.error("❌ Error updating file content:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Delete folder or file
router.delete("/:repoId/delete-folder", async (req, res) => {
  const { repoId } = req.params;
  const { targetPath } = req.body;
  if (!targetPath)
    return res.status(400).json({ message: "Target path is required" });

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const deleted = deleteNode(repo.tree, targetPath, "folder");
    if (!deleted) return res.status(404).json({ message: "Folder not found" });

    await repo.save();
    res.json({ message: "Folder deleted successfully", path: targetPath });
  } catch (err) {
    console.error("❌ Error deleting folder:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Rename file/folder
router.patch("/:repoId/rename-node", async (req, res) => {
  const { repoId } = req.params;
  const { oldPath, newName } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const updated = renameNodeAndPaths(repo.tree, oldPath, newName);
    if (!updated) return res.status(404).json({ message: "Node not found" });

    await repo.save();
    res.json({
      message: "Node renamed successfully",
      newPath: updated.newPath,
    });
  } catch (err) {
    console.error("❌ Error renaming node:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

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
    console.error("❌ Error fetching file content:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});
const filePath = require("path");
const fs = require("fs");

// 📂 Get the content of a file
router.get("/:repoId/open-file", async (req, res) => {
  const { repoId } = req.params;
  const { filePath: relativePath, uuid } = req.query;

  if (!uuid || !relativePath) {
    return res.status(400).json({ message: "UUID and filePath are required" });
  }

  const repoDir = path.join(repositoriesDir, uuid, repoId);
  const targetPath = path.join(repoDir, relativePath);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ message: "File does not exist" });
  }

  try {
    const content = await fs.promises.readFile(targetPath, "utf-8");
    res.json({ content });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to read file", error: err.message });
  }
});

module.exports = router;
