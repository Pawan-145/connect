import express from "express";
import Mood from "../models/moodModel.js";

const router = express.Router();

// 🔹 Save or update mood
router.post("/save", async (req, res) => {
  try {
    const { username, mood, reason } = req.body;
    const updated = await Mood.findOneAndUpdate(
      { username },
      { mood, reason },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// 🔹 Get all moods
router.get("/all", async (req, res) => {
  try {
    const moods = await Mood.find({});
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

export default router;
