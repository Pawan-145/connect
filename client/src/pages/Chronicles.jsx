

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Volume2, VolumeX } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Chronicles() {
  const [activeTab, setActiveTab] = useState("events");
  const [data, setData] = useState({ events: [], promises: [], punishments: [] });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", desc: "", date: "" });
  const [isPlaying, setIsPlaying] = useState(false); // 🎵 for toggle

  const USERNAME = "Rudraksh";
  const socket = io("https://sharing-secrets-2.onrender.com/");
  const audioRef = useRef(null);

  // 🎧 Handle Audio on Mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        fadeInAudio(audioRef.current, 0.3);
        setIsPlaying(true);
      }).catch(() => console.warn("🕹️ User interaction required to play sound."));
    }
  };

  const fadeInAudio = (audio, targetVolume) => {
    let fade = setInterval(() => {
      if (audio.volume < targetVolume) audio.volume += 0.01;
      else clearInterval(fade);
    }, 150);
  };

  const fetchChronicles = async () => {
    try {
      const res = await axios.get("https://sharing-secrets-2.onrender.com/chronicles");
      const structuredData = { events: [], promises: [], punishments: [] };
      res.data.forEach((item) => {
        if (item.type === "event") structuredData.events.push(item);
        else if (item.type === "promise") structuredData.promises.push(item);
        else if (item.type === "punishment") structuredData.punishments.push(item);
      });
      setData(structuredData);
    } catch (err) {
      console.error("❌ Error fetching chronicles:", err);
    }
  };

  useEffect(() => {
    fetchChronicles();
    socket.on("chronicle-update", fetchChronicles);
    return () => socket.disconnect();
  }, []);

  const handleSave = async () => {
    if (!formData.title) return alert("Title is required");
    try {
      const payload = {
        user: USERNAME,
        title: formData.title,
        description: formData.desc,
        type:
          activeTab === "events"
            ? "event"
            : activeTab === "promises"
            ? "promise"
            : "punishment",
      };
      if (activeTab === "events" && formData.date) payload.date = formData.date;

      await axios.post("https://sharing-secrets-2.onrender.com/chronicles", payload);
      setFormData({ title: "", desc: "", date: "" });
      setShowForm(false);
      fetchChronicles();
    } catch (err) {
      console.error("❌ Error saving chronicle:", err);
      alert("Failed to save, try again");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`https://sharing-secrets-2.onrender.com/chronicles/${id}`, {
        status: currentStatus === "done" ? "pending" : "done",
      });
      fetchChronicles();
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  const deleteChronicle = async (id) => {
    try {
      await axios.delete(`https://sharing-secrets-2.onrender.com/chronicles/${id}`);
      fetchChronicles();
    } catch (err) {
      console.error("❌ Error deleting chronicle:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF9F3] to-[#FAD1D1] text-gray-800 overflow-hidden">

      {/* 🌊 Ocean Sound */}
      <audio ref={audioRef} src="/sounds/ocean-waves.mp3" />

      {/* 🔊 Toggle Button */}
      <button
        onClick={toggleAudio}
        className="fixed top-1.5 right-4 bg-white/70 backdrop-blur-lg text-[#4FD1C5] p-3 rounded-full shadow-md hover:bg-[#4FD1C5] hover:text-white transition-all z-20"
      >
        {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>

      {/* Animated Waves (behind everything) */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Header */}
      <div className="text-center py-10 relative z-10">
        <h1 className="text-4xl font-bold text-[#4FD1C5] drop-shadow-sm">
          Chronicles Ocean 🌊
        </h1>
        <p className="text-[#F48FB1] mt-2 italic">
          Our memories, promises, and funny punishments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-6 px-2 relative z-10 flex-wrap">
        {["events", "promises", "punishments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium transition-all shadow-md text-sm sm:text-base ${
              activeTab === tab
                ? "bg-[#4FD1C5] text-white"
                : "bg-[#FAD1D1] text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 pb-32 relative z-10 overflow-y-auto max-h-[70vh]">
        {data[activeTab]?.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white bg-opacity-80 backdrop-blur-lg p-5 rounded-2xl shadow-md border border-[#FAD1D1]/40 hover:scale-[1.02] transition-transform ${
              item.status === "done" ? "opacity-70 line-through" : ""
            }`}
          >
            <h3 className="text-lg font-semibold text-[#4FD1C5]">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            {item.date && (
              <p className="text-xs mt-2 text-[#F48FB1]">
                {new Date(item.date).toLocaleDateString()}
              </p>
            )}

            <div className="flex justify-between mt-3">
              <button
                onClick={() => toggleStatus(item._id, item.status)}
                className="px-2 py-1 text-xs bg-green-400 text-white rounded hover:bg-green-500"
              >
                {item.status === "done" ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => deleteChronicle(item._id)}
                className="px-2 py-1 text-xs bg-red-400 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 bg-[#F48FB1] text-white p-4 rounded-full shadow-lg hover:bg-[#F06292] transition-all z-20 hover:scale-105"
      >
        <Plus size={24} />
      </button>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold text-[#4FD1C5] mb-4">
              Add {activeTab.slice(0, -1)}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            {activeTab === "events" && (
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#4FD1C5] text-white rounded hover:bg-[#38b2ac]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌊 Waves CSS */}
      <style>{`
        .wave {
          position: absolute;
          bottom: 0;
          width: 200%;
          height: 200px;
          border-radius: 1000% 1000% 0 0;
          animation: waveMotion 10s cubic-bezier(.36,.45,.63,.53) infinite;
        }
        .wave1 {
          background: rgba(79, 209, 197, 0.6);
          opacity: 0.9;
          animation-delay: 0s;
          z-index: 0;
        }
        .wave2 {
          background: rgba(72, 202, 228, 0.55);
          opacity: 0.6;
          animation-delay: 3s;
          z-index: 0;
        }
        .wave3 {
          background: rgba(173, 232, 244, 0.6);
          opacity: 0.5;
          animation-delay: 6s;
          z-index: 0;
        }
        @keyframes waveMotion {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10%) translateY(5px); }
          50% { transform: translateX(-25%) translateY(0); }
          75% { transform: translateX(-10%) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
    </div>
  );
}
