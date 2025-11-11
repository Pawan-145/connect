// ===========================================
// 🌸 server.js — Combined Frontend + Backend
// ===========================================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

// ===========================================
// ⚙️ SERVER + SOCKET SETUP
// ===========================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//Login Credentials
// Example backend users (replace with real DB later if needed)
// const USERS = [
//   { username: process.env.USER1_NAME, password: process.env.USER1_PASS },
//   { username: process.env.USER2_NAME, password: process.env.USER2_PASS },
// ];
const USERS = [
  {
    username: process.env.USER1_NAME,
    password: process.env.USER1_PASS,
    partner: process.env.USER2_NAME, // partner of user1
  },
  {
    username: process.env.USER2_NAME,
    password: process.env.USER2_PASS,
    partner: process.env.USER1_NAME, // partner of user2
  },
];
// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) return res.status(401).json({ error: "Access Denied ❌" });
  if (user.password !== password)
    return res.status(401).json({ error: "Wrong Password 😢" });

  // Success
  // res.json({ username: user.username });
   res.json({ username: user.username, partner: user.partner });
});


app.get("/health", (req, res) => {
  const secret = req.query.key;
  if (secret !== process.env.HEALTH_KEY) {
    return res.status(403).send("Forbidden");
  }
  res.status(200).send("OK");
});




// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Serve static uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ===========================================
// ☁️ CLOUDINARY CONFIG
// ===========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===========================================
// 🧠 MONGODB CONNECTION
// ===========================================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// User Schema
// const userSchema = new mongoose.Schema({
//   username: String,
//   partner: String,
//   mood: String,
// });

// const User = mongoose.model("User", userSchema);

// // Get moods for current user
// app.get("/moods/:username", async (req, res) => {
//   const username = req.params.username;
//   try {
//     const me = await User.findOne({ username });
//     const partner = await User.findOne({ username: me.partner });
//     res.json({
//       me: { username: me.username, mood: me.mood },
//       partner: { username: partner.username, mood: partner.mood },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.post("/register", async (req, res) => {
//   const { username, partner, mood } = req.body;
//   try {
//     const newUser = new User({ username, partner, mood: mood || "Calm" });
//     await newUser.save();
//     res.json({ message: "User created", user: newUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.put("/mood/:username", async (req, res) => {
//   const { mood } = req.body;
//   try {
//     const user = await User.findOneAndUpdate(
//       { username: req.params.username },
//       { mood },
//       { new: true }
//     );
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

  // ===========================================
// 🖼 GALLERY ROUTES
// ===========================================
app.post("/upload", async (req, res) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "love_gallery",
    });
    res.json(result);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "love_gallery/",
      max_results: 50,
    });
    res.json(result.resources);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});



app.delete("/delete/:public_id", async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id, { invalidate: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// const DP_DIR = path.join(process.cwd(), "uploads/dp");

// // Ensure DP folder exists
// if (!fs.existsSync(DP_DIR)) fs.mkdirSync(DP_DIR, { recursive: true });

// // -------------------
// // UPLOAD DP
// // -------------------
// app.post("/upload-dp", async (req, res) => {
//   try {
//     const file = req.files?.image;
//     const { username } = req.body;
//     if (!file || !username) return res.status(400).send("Missing file or username");

//     // Validate file type
//     if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype))
//       return res.status(400).send("Invalid file type");

//     const savePath = path.join(DP_DIR, username + path.extname(file.name));

//     // Overwrite DP
//     await file.mv(savePath);

//     res.json({ url: `/dp/${username}${path.extname(file.name)}` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Upload failed");
//   }
// });

// // -------------------
// // GET DP
// // -------------------
// // Fetch DP by username
// app.get("/dp/:username", (req, res) => {
//   try {
//     const files = fs.readdirSync(DP_DIR);
//     const file = files.find(f => f.startsWith(req.params.username));
//     if (!file) return res.json({ url: null });

//     // Return frontend-usable URL
//     res.json({ url: `/dp/${file}` });
//   } catch (err) {
//     console.error("❌ Get DP error:", err);
//     res.status(500).json({ url: null });
//   }
// });

// // -------------------
// // SERVE DP FOLDER SECURELY
// // -------------------
// app.use("/dp", express.static(DP_DIR));

//Display Picture

const DPSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  image: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const DP = mongoose.model("DP", DPSchema);

// -------------------
// UPLOAD DP
// -------------------
app.post("/upload-dp", async (req, res) => {
  try {
    const file = req.files?.image;
    const { username } = req.body;

    if (!file || !username) return res.status(400).send("Missing file or username");

    // Read file buffer
    const imgData = fs.readFileSync(file.tempFilePath);

    // Upsert (overwrite) DP
    await DP.findOneAndUpdate(
      { username },
      { image: imgData, contentType: file.mimetype, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: "DP uploaded successfully" });
  } catch (err) {
    console.error("Upload DP error:", err);
    res.status(500).send("Upload failed");
  }
});

// -------------------
// GET DP
// -------------------
app.get("/dp/:username", async (req, res) => {
  try {
    const dp = await DP.findOne({ username: req.params.username });
    if (!dp) return res.json({ url: null });

    // Convert to base64 for frontend
    const base64 = `data:${dp.contentType};base64,${dp.image.toString("base64")}`;
    res.json({ url: base64 });
  } catch (err) {
    console.error("Fetch DP error:", err);
    res.status(500).json({ url: null });
  }
});


// ===========================================
// 💞 MOODS
// ===========================================
const MoodSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  mood: { type: String, required: true },
  reason: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
});
const Mood = mongoose.model("Mood", MoodSchema);

app.get("/moods", async (_, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

app.post("/moods", async (req, res) => {
  const { user, mood, reason } = req.body;

  if (!user || !mood) {
    return res.status(400).json({ error: "User and mood are required" });
  }

  try {
    // Use upsert to avoid duplicates
    const updated = await Mood.findOneAndUpdate(
      { user },
      { mood, reason, timestamp: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    io.emit("mood-update", updated);
    console.log(`💾 Mood saved for ${user}: ${mood}`);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error saving mood:", err.message, err.code);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate user" });
    }
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// ===========================================
// 📜 CHRONICLES
// ===========================================
const ChronicleSchema = new mongoose.Schema({
  user: String,
  type: { type: String, enum: ["event", "promise", "punishment"], required: true },
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
});
const Chronicle = mongoose.model("Chronicle", ChronicleSchema);

app.post("/chronicles", async (req, res) => {
  try {
    const { user, type, title, description } = req.body;
    const newChronicle = new Chronicle({ user, type, title, description });
    await newChronicle.save();
    io.emit("chronicle-update");
    res.json(newChronicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to add chronicle" });
  }
});

app.get("/chronicles", async (_, res) => {
  try {
    const chronicles = await Chronicle.find().sort({ date: -1 });
    res.json(chronicles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chronicles" });
  }
});
app.delete("/chronicles/:id", async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid chronicle ID" });
  }

  try {
    const deleted = await Chronicle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Chronicle not found" });
    }

    io.emit("chronicle-update"); // notify clients
    res.json({ success: true, message: "Chronicle deleted" });
  } catch (err) {
    console.error("❌ Error deleting chronicle:", err.message);
    res.status(500).json({ error: "Failed to delete chronicle" });
  }
});

app.put("/chronicles/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid chronicle ID" });
  }

  try {
    const updated = await Chronicle.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Chronicle not found" });
    }

    io.emit("chronicle-update"); // Notify all clients
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating chronicle:", err.message);
    res.status(500).json({ error: "Failed to update chronicle" });
  }
});

// ===========================================
// 💸 EXPENSES
// ===========================================
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  paidBy: String,
  createdAt: { type: Date, default: Date.now },
});
const Expense = mongoose.model("Expense", expenseSchema);

app.get("/api/expenses", async (_, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, paidBy } = req.body;
    const expense = new Expense({ title, amount, paidBy });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// ===========================================
// 📝 NOTES
// ===========================================
const noteSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Note = mongoose.model("Note", noteSchema);

app.get("/api/notes", async (_, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================================
// 🎵 MUSIC NOTES & SONGS
// ===========================================
const musicNoteSchema = new mongoose.Schema(
  {
    title: String,
    note: String,
    noteBy: String,
    pinned: Boolean,
    pinnedBy: String,
    done: Boolean,
  },
  { timestamps: true }
);
const MusicNote = mongoose.model("MusicNote", musicNoteSchema);

app.get("/musicnotes", async (_, res) => res.json(await MusicNote.find()));
app.post("/musicnotes", async (req, res) => res.json(await new MusicNote(req.body).save()));
app.put("/musicnotes/:id", async (req, res) =>
  res.json(await MusicNote.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/musicnotes/:id", async (req, res) => {
  await MusicNote.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Serve local songs folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/songs", express.static(path.join(__dirname, "../client/public/songs")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// List all songs
app.get("/api/songs", (req, res) => {
  const folder = path.join(__dirname, "../client/public/songs");
  if (!fs.existsSync(folder)) return res.json([]);
  const songs = fs
    .readdirSync(folder)
    .filter((f) => f.endsWith(".mp3"))
    .map((f, i) => ({ _id: i + 1, title: f.replace(".mp3", ""), url: `/songs/${f}` }));
  res.json(songs);
});

// ===========================================
// 🔌 SOCKET.IO
// ===========================================
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

    socket.on("save-mood", async ({ user, mood, reason }) => {
    if (!user || !mood) return;

    try {
      const updated = await Mood.findOneAndUpdate(
        { user },
        { mood, reason, timestamp: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      io.emit("mood-update", updated);
      console.log(`💾 Socket mood saved for ${user}: ${mood}`);
    } catch (err) {
      console.error("❌ Error during socket mood save:", err.message);
    }
    
  });

  socket.on("add-note", async ({ username, text }) => {
    const note = new Note({ username, text });
    await note.save();
    io.emit("note-update", note);
  });

  socket.on("delete-note", async (id) => {
    await Note.findByIdAndDelete(id);
    io.emit("note-delete", id);
  });

  // Listen together (music)
  socket.on("playSong", (data) => socket.broadcast.emit("currentSong", data));
  socket.on("pauseSong", () => socket.broadcast.emit("partnerPauseSong"));
  socket.on("resumeSong", () => socket.broadcast.emit("partnerResumeSong"));

  socket.on("disconnect", () => console.log("❌ Socket disconnected:", socket.id));
});

// ===========================================
// ⚛️ SERVE REACT BUILD
// ===========================================
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});


// ===========================================
// ✅ START SERVER
// ===========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
