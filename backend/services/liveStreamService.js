const fs = require("fs");
const path = require("path");

const liveSessions = {}; // Track active live coding sessions
const subscribers = {}; // Track subscribers per repo

// ✅ Start a live session
function startLiveSession(username, repoName) {
  liveSessions[username] = repoName;
  console.log(`${username} started live coding in ${repoName}`);
  return { type: "LIVE_STARTED", username, repoName };
}

// ✅ Stop a live session
function stopLiveSession(username) {
  if (liveSessions[username]) {
    const repoName = liveSessions[username];
    delete liveSessions[username];
    console.log(`${username} stopped live coding`);
    return { type: "LIVE_STOPPED", username, repoName };
  }
  return null;
}

// ✅ Update file content in repository and notify subscribers
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

// ✅ Export services
module.exports = {
  startLiveSession,
  stopLiveSession,
  updateFile,
  subscribers,
};
