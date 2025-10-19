import mongoose from "mongoose";

// Define Mood schema
const MoodSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  mood: { type: String, required: true },
  reason: { type: String, default: "" },
},
{timestamps: true}
);

const Mood = mongoose.model("Mood", MoodSchema);

export default Mood;

