
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const timeline = [
  { date: "21 Apr", event: "First talk 💬" },
  { date: "27 Apr", event: "First meet 🏏" },
  { date: "May–July", event: "Endless talks 💞" },
  { date: "1 Aug", event: "I proposed ❤️" },
  { date: "3 Aug", event: "She proposed 💍" },
  { date: "13 Aug", event: "First date 🍨" },
  { date: "16 Aug", event: "Stayed together 🌙" },
  { date: "21 Sep", event: "Rings & Flowers 💎🌸" },
];

export default function ProfileFrame({ user }) {
  const [open, setOpen] = useState(false);
  const [dp, setDp] = useState("/default_dp.png");
  const [uploading, setUploading] = useState(false);

  const radius = 150;
  const centerOffset = 20;
  const BACKEND_URL = "https://sharing-secrets-2.onrender.com";

  useEffect(() => {
    const fetchDP = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/dp/${user.username}`);
        if (res.data.url) setDp(res.data.url);
        else setDp("/default_dp.png");
      } catch (err) {
        console.error("Error fetching DP:", err);
        setDp("/default_dp.png");
      }
    };
    fetchDP();
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("username", user.username);

    try {
      const res = await axios.post(`${BACKEND_URL}/upload-dp`, formData);
      if (res.data.url) setDp(BACKEND_URL + res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload DP");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center mt-27 px-4 sm:px-0">
      {/* 💖 Profile Circle */}
      <motion.div
        onClick={() => setOpen(!open)}
        
        className="relative cursor-pointer w-48 h-48 rounded-full border-[4px] border-pink-300 
                   shadow-[0_0_25px_rgba(255,111,163,0.5)] bg-white/10 backdrop-blur-md 
                   flex justify-center items-center z-10 -mt-10"
        animate={{ scale: open ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        <img
          src={dp}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />

        {/* Upload Button */}
        <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-pink-600">
          <FaPlus />
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-sm rounded-full">
            Uploading...
          </div>
        )}
      </motion.div>

      {/* Timeline Memories */}
      {timeline.map((item, i) => {
        const angle = (i / timeline.length) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius + centerOffset + 40;

        return (
          <motion.div
            key={i}
            className="absolute text-center bg-white/80 text-[9px] sm:text-xs md:text-sm 
                       text-pink-700 font-semibold px-2 py-1 rounded-full border border-pink-300 shadow-lg z-20"
            animate={{
              x: open ? x : 0,
              y: open ? y : -35,
              scale: open ? 1 : 0.5,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 8,
              delay: i * 0.05,
            }}
          >
            <p className="font-bold">{item.date}</p>
            <p>{item.event}</p>
          </motion.div>
        );
      })}

      <p className="mt-4 text-xs text-pink-500 italic">
        {open ? "Tap to close memories 💭" : "Tap to open memories 💫"}
      </p>
    </div>
  );
}
