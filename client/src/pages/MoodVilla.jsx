
// MoodVilla.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const moodsList = [
  { emoji: "😊", label: "Happy", gif: "/gifs/happy.gif" },
  { emoji: "😢", label: "Sad", gif: "/gifs/sad.gif" },
  { emoji: "😡", label: "Angry", gif: "/gifs/angry.gif" },
  { emoji: "😍", label: "Romantic", gif: "/gifs/romantic.gif" },
  { emoji: "😴", label: "Sleepy", gif: "/gifs/sleepy.gif" },
  { emoji: "😎", label: "Cool", gif: "/gifs/cool.gif" },
  { emoji: "🤔", label: "Thinking", gif: "/gifs/thinking.gif" },
  { emoji: "🥰", label: "Loved", gif: "/gifs/loved.gif" },
  { emoji: "😜", label: "Playful", gif: "/gifs/playful.gif" },
  { emoji: "🥺", label: "Missing You", gif: "/gifs/missingyou.gif" },
  { emoji: "😌", label: "Calm", gif: "/gifs/calm.gif" },
  { emoji: "😃", label: "Excited", gif: "/gifs/excited.gif" },
  { emoji: "😰", label: "Nervous", gif: "/gifs/nervous.gif" },
  { emoji: "😲", label: "Shocked", gif: "/gifs/shocked.gif" },
  { emoji: "😪", label: "Tired", gif: "/gifs/tired.gif" },
  { emoji: "😕", label: "Confused", gif: "/gifs/confused.gif" },
  { emoji: "🤯", label: "Mind Blown", gif: "/gifs/mindblown.gif" },
  { emoji: "🤗", label: "Hugging", gif: "/gifs/hugging.gif" },
  { emoji: "😇", label: "Blessed", gif: "/gifs/blessed.gif" },
  { emoji: "🤤", label: "Hungry", gif: "/gifs/hungry.gif" },
  { emoji: "🙏", label: "Grateful", gif: "/gifs/grateful.gif" },
];

const socket = io("https://sharing-secrets-2.onrender.com/");

export default function MoodVilla({ user, onBack }) {
  const [myMood, setMyMood] = useState(null);
  const [reasonVisible, setReasonVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);
  const [partnerMood, setPartnerMood] = useState(null);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    // listen for other user's updates
    const handler = (data) => {
      if (data.user !== user.username) {
        setPartnerMood({
          emoji: moodsList.find((m) => m.label === data.mood)?.emoji,
          label: data.mood,
          reason: data.reason,
        });
      }
      // if you want to show sync message when both same mood:
      // if (myMood?.label === data.mood && myMood) {
      //   setSyncMessage(`💞 Both of you are feeling ${data.mood}!`);
      // } else {
      //   setSyncMessage("");
      // }
    };

    socket.on("mood-update", handler);
    return () => socket.off("mood-update", handler);
  }, [myMood, user]);

  const handleSelectMood = (mood) => setMyMood(mood);

  const handleSave = async () => {
    if (!myMood) return;
    setSaved(true);
    const payload = {
  user: user.username, // ✅ send string instead of object
  mood: myMood.label,
  reason: reason || "",
};

console.log("💌 Sending mood data:", payload);

try {
  const res = await axios.post("https://sharing-secrets-2.onrender.com/moods", payload, {
    headers: { "Content-Type": "application/json" },
  });
  console.log("✅ Mood saved:", res.data);

  socket.emit("save-mood", payload); // ✅ keep it consistent
  setTimeout(onBack, 800);
} catch (err) {
  console.error("❌ Error saving mood:", err.response?.data || err.message);
  setSaved(false);
}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-[#FFF5E1] to-teal-100 flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-4xl font-bold text-teal-700 mb-8">💞 Mood Villa</h1>

      {!saved && (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mb-6">
            {moodsList.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleSelectMood(mood)}
                className={`text-3xl p-3 rounded-2xl transition-all shadow-md ${
                  myMood?.label === mood.label
                    ? "bg-teal-400 scale-110 shadow-lg"
                    : "bg-white hover:bg-teal-100"
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>

          {!reasonVisible ? (
            <button
              onClick={() => setReasonVisible(true)}
              className="px-4 py-2 mb-4 text-sm font-semibold text-white bg-pink-400 hover:bg-pink-500 rounded-full shadow-md"
            >
              ➕ Add a Reason
            </button>
          ) : (
            <div className="flex flex-col items-center mb-4">
              <textarea
                placeholder="Write your reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-80 p-3 rounded-lg shadow bg-white text-gray-700 mb-2 border border-teal-200 focus:ring-2 focus:ring-teal-400"
              />
              <button
                onClick={() => setReasonVisible(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-pink-400 hover:bg-pink-500 rounded-full shadow-md"
              >
                ✖ Hide reason
              </button>
            </div>
          )}

          <button
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Save Mood 💌
          </button>
        </>
      )}

      {saved && <div className="mt-6 text-green-600 font-semibold">Mood Saved! 🌸</div>}

      {syncMessage && (
        <div className="mt-6 bg-pink-200 text-pink-800 font-bold px-4 py-2 rounded-lg shadow-lg animate-bounce">
          {syncMessage}
        </div>
      )}
    </div>
  );
}
