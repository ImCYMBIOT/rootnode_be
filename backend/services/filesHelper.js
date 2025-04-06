// utils/treeHelper.js

// 📁 Create a file node
function createFileNode(name, path, content = "") {
  return {
    name,
    type: "file",
    path,
    content,
  };
}

// 📁 Create a folder node
function createFolderNode(name, path) {
  return {
    name,
    type: "folder",
    path,
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
function renameNodeAndPaths(currentNode, oldPath, newPath) {
  const node = findNodeByPath(currentNode, oldPath);
  if (!node) return false;

  // Update path recursively for the node and its children
  const updatePaths = (n, baseOld, baseNew) => {
    n.path = n.path.replace(baseOld, baseNew);
    if (n.type === "folder" && n.children) {
      for (const child of n.children) {
        updatePaths(child, baseOld, baseNew);
      }
    }
  };

  updatePaths(node, oldPath, newPath);

  // Update name
  const newName = newPath.split("/").pop();
  node.name = newName;

  return true;
}

module.exports = {
  createFileNode,
  createFolderNode,
  findNodeByPath,
  insertNode,
  deleteNode,
  updateFileContent,
  renameNodeAndPaths,
};
