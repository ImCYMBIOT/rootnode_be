const express = require("express");
const Stream = require("../models/stream");

const router = express.Router();

// ✅ Start a stream
router.post("/start", async (req, res) => {
  const { uuid, username, title, description } = req.body;

  if (!uuid || !title) {
    return res.status(400).json({ message: "UUID and title are required" });
  }

  try {
    const stream = new Stream({
      uuid,
      username,
      title,
      description,
      isLive: true,
    });
    await stream.save();
    res.json({ message: "Stream started", stream });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to start stream", error: err.message });
  }
});

// ✅ Stop a stream
router.post("/stop", async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: "UUID is required" });
  }

  try {
    const stream = await Stream.findOneAndUpdate(
      { uuid, isLive: true },
      { isLive: false },
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ message: "Active stream not found" });
    }

    res.json({ message: "Stream stopped", stream });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to stop stream", error: err.message });
  }
});

// ✅ Get all live streams
router.get("/live", async (req, res) => {
  try {
    const streams = await Stream.find({ isLive: true });
    res.json(streams);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch live streams", error: err.message });
  }
});

module.exports = router;
