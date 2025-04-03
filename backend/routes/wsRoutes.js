const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { updateFile } = require("../services/liveStreamService"); // Import update function
const activeStreams = new Map(); // Track active streams

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
            handleStartStream(ws, data.repoName);
            break;
          case "STOP_STREAM":
            handleStopStream(ws, data.repoName);
            break;
          case "SUBSCRIBE_STREAM":
            handleSubscribeStream(ws, data.repoName);
            break;
          case "UNSUBSCRIBE_STREAM":
            handleUnsubscribeStream(ws, data.repoName);
            break;
          case "UPDATE_FILE":
            handleUpdateFile(ws, data);
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
function handleStartStream(ws, repoName) {
  if (!activeStreams.has(repoName)) {
    activeStreams.set(repoName, new Set());
  }
  activeStreams.get(repoName).add(ws);
  ws.send(JSON.stringify({ type: "STREAM_STARTED", repoName }));
  console.log(`Live stream started for repository: ${repoName}`);
}

// ✅ Handle stopping a live stream
function handleStopStream(ws, repoName) {
  if (activeStreams.has(repoName)) {
    activeStreams.delete(repoName);
    console.log(`Live stream stopped for repository: ${repoName}`);
  }
  ws.send(JSON.stringify({ type: "STREAM_STOPPED", repoName }));
}

// ✅ Handle subscribing to a live stream
function handleSubscribeStream(ws, repoName) {
  if (!activeStreams.has(repoName)) {
    sendError(ws, "Stream not active");
    return;
  }
  activeStreams.get(repoName).add(ws);
  ws.send(JSON.stringify({ type: "SUBSCRIBED", repoName }));
  console.log(`Client subscribed to ${repoName}`);
}

// ✅ Handle unsubscribing from a live stream
function handleUnsubscribeStream(ws, repoName) {
  if (activeStreams.has(repoName)) {
    activeStreams.get(repoName).delete(ws);
    ws.send(JSON.stringify({ type: "UNSUBSCRIBED", repoName }));
    console.log(`Client unsubscribed from ${repoName}`);
  }
}

// ✅ Handle file updates and broadcast them to all subscribers
function handleUpdateFile(ws, { repoName, filePath, content }) {
  try {
    const repositoriesDir = "./repositories";
    const repoPath = path.join(repositoriesDir, repoName);

    if (!fs.existsSync(repoPath)) {
      sendError(ws, `Repository ${repoName} does not exist.`);
      return;
    }

    updateFile(repositoriesDir, repoName, filePath, content);

    const updateMessage = { type: "FILE_UPDATED", repoName, filePath, content };
    broadcastToClients(repoName, updateMessage); // Notify all subscribed clients

    console.log(`File ${filePath} updated in ${repoName}`);
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
}

// ✅ Send error messages to clients
function sendError(ws, message) {
  ws.send(JSON.stringify({ type: "ERROR", message }));
}

module.exports = { setupWebSocket };
