const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const {
  updateFile,
  startLiveSession,
  stopLiveSession,
  subscribers,
} = require("../services/liveStreamService");

const activeStreams = new Map(); // Track active streams per repo

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      try {
        console.log("Received WebSocket message:", message);
        const data = JSON.parse(message);

        switch (data.type) {
          case "START_STREAM":
            handleStartStream(ws, data.username, data.repoName, wss);
            break;
          case "STOP_STREAM":
            handleStopStream(ws, data.username);
            break;
          case "SUBSCRIBE_STREAM":
            handleSubscribeStream(ws, data.repoName);
            break;
          case "UNSUBSCRIBE_STREAM":
            handleUnsubscribeStream(ws, data.repoName);
            break;
          case "UPDATE_FILE":
            handleUpdateFile(ws, data, wss);
            break;
          default:
            sendError(ws, `Unknown message type: ${data.type}`);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        sendError(ws, "Invalid message format or processing error.");
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      removeClientFromStreams(ws);
    });
  });

  console.log("WebSocket server initialized");
  return wss;
}

// ✅ Handle starting a live stream
function handleStartStream(ws, username, repoName, wss) {
  const repositoriesDir = "./repositories";

  // Register live session (for external tracking)
  startLiveSession(username, repoName);

  // Track clients for internal broadcasting
  if (!activeStreams.has(repoName)) {
    activeStreams.set(repoName, new Set());
  }
  activeStreams.get(repoName).add(ws);

  ws.send(JSON.stringify({ type: "STREAM_STARTED", repoName }));
  console.log(`${username} started a stream on ${repoName}`);
}

// ✅ Handle stopping a live stream
function handleStopStream(ws, username) {
  const result = stopLiveSession(username);

  if (result && activeStreams.has(result.repoName)) {
    activeStreams.delete(result.repoName);
    console.log(`Live stream stopped for ${result.repoName}`);
    ws.send(
      JSON.stringify({ type: "STREAM_STOPPED", repoName: result.repoName })
    );
  } else {
    sendError(ws, `No active stream found for ${username}`);
  }
}

// ✅ Handle subscribing to a live stream
function handleSubscribeStream(ws, repoName) {
  if (!subscribers[repoName]) {
    subscribers[repoName] = new Set();
  }
  subscribers[repoName].add(ws);

  if (!activeStreams.has(repoName)) {
    activeStreams.set(repoName, new Set());
  }
  activeStreams.get(repoName).add(ws);

  ws.send(JSON.stringify({ type: "SUBSCRIBED", repoName }));
  console.log(`Client subscribed to ${repoName}`);
}

// ✅ Handle unsubscribing from a live stream
function handleUnsubscribeStream(ws, repoName) {
  if (subscribers[repoName]) {
    subscribers[repoName].delete(ws);
  }
  if (activeStreams.has(repoName)) {
    activeStreams.get(repoName).delete(ws);
  }

  ws.send(JSON.stringify({ type: "UNSUBSCRIBED", repoName }));
  console.log(`Client unsubscribed from ${repoName}`);
}

// ✅ Handle file updates and broadcast them to all subscribers
function handleUpdateFile(ws, { repoName, filePath, content }, wss) {
  try {
    const repositoriesDir = "./repositories";

    if (!fs.existsSync(path.join(repositoriesDir, repoName))) {
      sendError(ws, `Repository ${repoName} does not exist.`);
      return;
    }

    // Update file and notify subscribers (via service)
    updateFile(repositoriesDir, repoName, filePath, content, wss);

    // Broadcast manually to any additional subscribers tracked locally
    const updateMessage = {
      type: "FILE_UPDATED",
      repoName,
      filePath,
      content,
    };
    broadcastToClients(repoName, updateMessage);
  } catch (error) {
    console.error(`Error updating file: ${error.message}`);
    sendError(ws, `Error updating file: ${error.message}`);
  }
}

// ✅ Broadcast messages to all subscribers of a repo
function broadcastToClients(repoName, message) {
  if (activeStreams.has(repoName)) {
    activeStreams.get(repoName).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

// ✅ Remove disconnected clients from all active streams
function removeClientFromStreams(ws) {
  activeStreams.forEach((clients, repoName) => {
    if (clients.has(ws)) {
      clients.delete(ws);
      console.log(`Client removed from ${repoName} stream`);
    }
  });

  Object.keys(subscribers).forEach((repoName) => {
    subscribers[repoName].delete(ws);
  });
}

// ✅ Send error messages to clients
function sendError(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "ERROR", message }));
  }
}

module.exports = { setupWebSocket };
