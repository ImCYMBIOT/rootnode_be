const path = require("path");
const { BASE_REPO_DIR } = require("../config");

// 📁 Create a file node
function createFileNode(name, fullPath, content = "") {
  return {
    name,
    type: "file",
    path: fullPath,
    content,
  };
}

// 📁 Create a folder node
function createFolderNode(name, fullPath) {
  return {
    name,
    type: "folder",
    path: fullPath,
    children: [],
  };
}

// 🔍 Recursively find a node by its full path
function findNodeByPath(root, targetPath) {
  if (root.path === targetPath) return root;

  if (root.type === "folder" && root.children) {
    for (const child of root.children) {
      const found = findNodeByPath(child, targetPath);
      if (found) return found;
    }
  }

  return null;
}

// ➕ Insert a new node under a target folder path
function insertNode(currentNode, targetPath, newNode) {
  if (currentNode.path === targetPath && currentNode.type === "folder") {
    if (!currentNode.children) currentNode.children = [];
    currentNode.children.push(newNode);
    return true;
  }

  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (insertNode(child, targetPath, newNode)) return true;
    }
  }

  return false;
}

// ❌ Delete a node (file or folder) by its path and optional type
function deleteNode(currentNode, targetPath, type = null) {
  if (!currentNode.children) return false;

  const index = currentNode.children.findIndex(
    (child) => child.path === targetPath && (!type || child.type === type)
  );

  if (index !== -1) {
    currentNode.children.splice(index, 1);
    return true;
  }

  for (const child of currentNode.children) {
    if (deleteNode(child, targetPath, type)) return true;
  }

  return false;
}

// 📝 Update file content (shallow)
function updateFileContent(root, filePath, newContent) {
  const fileNode = findNodeByPath(root, filePath);
  if (fileNode && fileNode.type === "file") {
    fileNode.content = newContent;
    return true;
  }
  return false;
}

// 🔄 Rename node (file/folder) and auto-update all nested paths
function renameNodeAndPaths(root, targetPath, newName) {
  const node = findNodeByPath(root, targetPath);
  if (!node) return false;

  const parentPath = path.dirname(node.path);
  const newPath = path.join(parentPath, newName);
  updatePathsRecursively(node, newPath);

  return { newPath };
}

function updatePathsRecursively(node, newPath) {
  const oldPath = node.path;
  node.name = path.basename(newPath);
  node.path = newPath;

  if (node.children && node.children.length) {
    for (let child of node.children) {
      const relative = path.relative(oldPath, child.path);
      const childNewPath = path.join(newPath, relative);
      updatePathsRecursively(child, childNewPath);
    }
  }
}

module.exports = {
  BASE_REPO_DIR,
  createFileNode,
  createFolderNode,
  findNodeByPath,
  insertNode,
  deleteNode,
  updateFileContent,
  renameNodeAndPaths,
};
