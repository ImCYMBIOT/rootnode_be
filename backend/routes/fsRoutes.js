const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Base directory for repositories
const repositoriesDir = path.join(__dirname, "..", "repositories");

// Helper to construct full path
const getFullPath = (uuid, repoId, relativePath = "") =>
  path.join(repositoriesDir, uuid, repoId, relativePath);

// CREATE A FILE
// POST /fs/create-file
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

// CREATE A FOLDER
// POST /fs/create-folder
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

// UPDATE A FILE
// PATCH /fs/update-file
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

// DELETE FILE OR FOLDER
// DELETE /fs/delete
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

// READ A FILE
// POST /fs/read-file
router.post("/read-file", async (req, res) => {
  const { uuid, repoId, relativePath } = req.body;
  const filePath = getFullPath(uuid, repoId, relativePath);

  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    res.json({ content });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to read file", details: err.message });
  }
});

module.exports = router;
