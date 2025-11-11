import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import ThoughtofDay from "../components/ThoughtofDay";
import WidgetsGrid from "../components/WidgetsGrid";
// import RelationshipBar from "../components/RelationshipBar";
import ProfileFrame from "../components/ProfileFrame";
import SlidingPuzzle from "../components/SlidingPuzzle";

const RELATIONSHIP_START = "2025-04-21T00:00:00.000Z";

// Mood → happiness mapping
const moodScores = {
  Happy: 90,
  Sad: 40,
  Angry: 20,
  Romantic: 100,
  Sleepy: 60,
  Cool: 80,
  Thinking: 70,
  Loved: 95,
  Playful: 85,
  "Missing You": 75,
  Calm: 80,
  Excited: 90,
  Nervous: 50,
  Shocked: 55,
  Tired: 60,
  Confused: 50,
  "Mind Blown": 65,
  Hugging: 95,
  Blessed: 90,
  Hungry: 70,
  Grateful: 95,
};

function daysSince(startISO) {
  const start = new Date(startISO);
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff =
    Math.floor((now.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / msPerDay) + 1;
  return diff;
}

export default function HomePage({ user, onLock }) {
  const loveDays = useMemo(() => daysSince(RELATIONSHIP_START), []);

  // ✅ Define all states properly
  const [youMood, setYouMood] = useState("Calm");
  const [partnerMood, setPartnerMood] = useState("Calm");
  const [youScore, setYouScore] = useState(50);
  const [partnerScore, setPartnerScore] = useState(50);

  const pinned = {
    images: [
      { url: "/sample1.jpg", caption: "Our first day" },
      { url: "/sample2.jpg", caption: "Beach day" },
    ],
    mood: "Blissful",
    events: [{ title: "Dinner 25 Oct", date: "2025-10-25" }],
    punishments: [{ title: "Dish duty" }],
    promises: [{ title: "Surprise trip" }],
    location: { distance: "12.3 km", lastSeen: "Today 09:12" },
    poems: [{ text: "In your eyes I found my home..." }],
  };

  // ✅ Fetch moods for both users from backend (MongoDB)
  // useEffect(() => {
  //   const fetchMoods = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/moods");
  //       const moods = res.data;

  //       const youData = moods.find((m) => m.user === user.username);
  //       const partnerData = moods.find((m) => m.user === user.partner);

  //       if (youData) {
  //         setYouMood(youData.mood);
  //         setYouScore(moodScores[youData.mood] || 50);
  //       }
  //       if (partnerData) {
  //         setPartnerMood(partnerData.mood);
  //         setPartnerScore(moodScores[partnerData.mood] || 50);
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to fetch moods:", err);
  //     }
  //   };

  //   fetchMoods();

  //   // Optional auto-refresh every 10 seconds for live updates
  //   const interval = setInterval(fetchMoods, 10000);
  //   return () => clearInterval(interval);
  // }, [user]);

  return (
    <div className="max-w-md mx-auto pt-8 pb-24 px-4">
      {/* 🩷 Welcome Banner */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/8 rounded-3xl p-5 backdrop-blur-sm border border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-900 font-sans">Welcome back</p>
            <h1 className="text-2xl font-semibold text-[#FF6FA3] leading-tight">
              {user?.username ?? "My Love"} <span className="text-xl">💞</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-900 font-sans">Days</p>
            <div className="text-xl font-bold text-zinc-900 font-sans">{loveDays}</div>
            <p className="text-[10px] text-zinc-900 font-sans">since Apr 21, 2025</p>
          </div>
        </div>

        {/* Thought & Lock */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <ThoughtofDay />
          <div className="flex gap-2 mt-2">
            <button
              onClick={onLock}
              className="flex-1 py-2 rounded-xl bg-[#008080] text-white font-semibold cursor-pointer"
            >
              Lock 🔒
            </button>
            <button
              className="px-3 py-2 rounded-xl bg-white/10 text-white/90"
              onClick={() => alert("Share a smile ✨")}
            >
              <FaHeart className="text-pink-400" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 💕 Relationship Mood Bar */}
      <div className="mt-4">
        < SlidingPuzzle />
      </div>

      {/* 📸 Profile Section */}
      <div className="mt-4">
        <ProfileFrame user={user} pinned={pinned} loveDays={loveDays} />
      </div>
    </div>
  );
}
