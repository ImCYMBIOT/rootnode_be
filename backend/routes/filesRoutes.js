const express = require("express");
const router = express.Router();
const Files = require("../models/filesModel");
const { updateNodeContent } = require("../services/filesHelper");

// GET /files/:id - get file tree by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const fileTree = await Files.findById(id);

    if (!fileTree) {
      return res.status(404).json({ error: "File structure not found" });
    }

    res.status(200).json(fileTree.tree);
  } catch (err) {
    console.error("Error fetching file structure:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching file structure" });
  }
});

router.post("/:repoId/add-file", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, fileName, content = "" } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const newNode = {
      name: fileName,
      type: "file",
      path: path.join(parentPath, fileName),
      content,
      children: [], // not used for files
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success) {
      return res.status(400).json({ message: "Parent path not found" });
    }

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

router.post("/:repoId/add-folder", async (req, res) => {
  const { repoId } = req.params;
  const { parentPath, folderName } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const newNode = {
      name: folderName,
      type: "folder",
      path: path.join(parentPath, folderName),
      children: [],
      content: "",
    };

    const success = insertNode(repo.tree, parentPath, newNode);
    if (!success) {
      return res.status(400).json({ message: "Parent path not found" });
    }

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

router.patch("/:repoId/update-content", async (req, res) => {
  const { repoId } = req.params;
  const { filePath, newContent } = req.body;

  try {
    const repo = await Files.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const updated = updateNodeContent(repo.tree, filePath, newContent);
    if (!updated) {
      return res.status(404).json({ message: "File not found" });
    }

    await repo.save();

    res.json({
      message: "File content updated successfully",
      filePath,
    });
  } catch (err) {
    console.error("❌ Error updating file content:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

const { deleteNode } = require("../services/filesHelper"); // Make sure this helper is defined

router.delete("/:repoId/delete-folder", async (req, res) => {
  const { repoId } = req.params;
  const { targetPath } = req.body;

  if (!targetPath)
    return res.status(400).json({ message: "Target path is required" });

  try {
    const repo = await Files.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const deleted = deleteNode(repo.tree, targetPath, "folder");

    if (!deleted) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await repo.save();

    res.json({
      message: "Folder deleted successfully",
      path: targetPath,
    });
  } catch (err) {
    console.error("❌ Error deleting folder:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
