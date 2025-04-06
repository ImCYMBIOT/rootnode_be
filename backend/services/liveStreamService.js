const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const liveSessions = {};
const subscribers = {};
const watchers = {}; // NEW: Store chokidar watchers

// ✅ Start a live session
function startLiveSession(username, repoName, repositoriesDir, wss) {
  liveSessions[username] = repoName;

  const repoPath = path.join(repositoriesDir, repoName);

  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository ${repoName} does not exist.`);
  }

  console.log(`${username} started live coding in ${repoName}`);

  // Start watching this repo's files
  const watcher = chokidar.watch(repoPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", (fullFilePath) => {
    const filePath = path.relative(repoPath, fullFilePath);
    const content = fs.readFileSync(fullFilePath, "utf-8");

    console.log(`Detected change: ${filePath}`);

    updateFile(repositoriesDir, repoName, filePath, content, wss);
  });

  watchers[username] = watcher;

  return { type: "LIVE_STARTED", username, repoName };
}

// ✅ Stop live session
function stopLiveSession(username) {
  const repoName = liveSessions[username];

  if (repoName) {
    delete liveSessions[username];

    // Stop and clean up watcher
    if (watchers[username]) {
      watchers[username].close();
      delete watchers[username];
    }

    console.log(`${username} stopped live coding`);
    return { type: "LIVE_STOPPED", username, repoName };
  }

  return null;
}

// ✅ Update file and notify all viewers
function updateFile(repositoriesDir, repoName, filePath, content, wss) {
  const repoPath = path.join(repositoriesDir, repoName);
  const fullFilePath = path.join(repoPath, filePath);

  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository ${repoName} does not exist.`);
  }

  fs.writeFileSync(fullFilePath, content);
  console.log(`Updated file: ${filePath}`);

  // Notify all subscribers
  if (subscribers[repoName]) {
    subscribers[repoName].forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({ type: "FILE_UPDATED", repoName, filePath, content })
        );
      }
    });
  }

  return { type: "FILE_UPDATED", repoName, filePath, content };
}

module.exports = {
  startLiveSession,
  stopLiveSession,
  updateFile,
  subscribers,
};
