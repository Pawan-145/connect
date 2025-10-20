// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const timeline = [
//   { date: "21 Apr", event: "First talk 💬" },
//   { date: "27 Apr", event: "First meet 🏏" },
//   { date: "May–July", event: "Endless talks 💞" },
//   { date: "1 Aug", event: "I proposed ❤️" },
//   { date: "3 Aug", event: "She proposed 💍" },
//   { date: "13 Aug", event: "First date 🍨" },
//   { date: "16 Aug", event: "Stayed together 🌙" },
//   { date: "21 Sep", event: "Rings & Flowers 💎🌸" },
// ];

// export default function ProfileFrame({ user }) {
//   const [open, setOpen] = useState(false);

//   const radius = 160; // Distance from center of profile
//   const centerOffset = 10; // vertical adjustment if needed

//   return (
//     <div className="relative flex flex-col items-center mt-32 px-4 sm:px-0">
//       {/* 💖 Profile Circle */}
//       <motion.div
//         onClick={() => setOpen(!open)}
//         className="relative cursor-pointer w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 
//                    rounded-full border-[4px] border-pink-300 
//                    shadow-[0_0_25px_rgba(255,111,163,0.5)] 
//                    bg-white/10 backdrop-blur-md 
//                    flex justify-center items-center z-10"
//         animate={{ scale: open ? 1.05 : 1, rotate: open ? 3 : 0 }}
//         transition={{ type: "spring", stiffness: 120, damping: 10 }}
//       >
//        <img
//   src="https://sharing-secrets-2.onrender.com/uploads/D1234P4567_dont_try.jpeg"
//   alt="Profile"
//   className="w-full h-full object-cover rounded-full"
// />


//         {/* ✨ Floating Arrows */}
//         {/* {!open && (
//           <>
//             <motion.img
//               src="/arrow-top.gif"
//               alt="arrow"
//               className="absolute -top-8 left-1/2 w-10 sm:w-12 transform -translate-x-1/2 z-20"
//               animate={{ y: [0, -6, 0] }}
//               transition={{ repeat: Infinity, duration: 2 }}
//             />
//             <motion.img
//               src="/arrow-bottom.gif"
//               alt="arrow"
//               className="absolute -bottom-8 left-1/2 w-10 sm:w-12 transform -translate-x-1/2 rotate-180 z-20"
//               animate={{ y: [0, 6, 0] }}
//               transition={{ repeat: Infinity, duration: 2 }}
//             />
//           </>
//         )} */}
//       </motion.div>

//       {/* 💞 Timeline Memories in Circular Layout */}
//       <AnimatePresence>
//         {open &&
//           timeline.map((item, i) => {
//             const angle = (i / timeline.length) * 2 * Math.PI; // Evenly spaced around circle
//             const x = Math.cos(angle) * radius;
//             const y = Math.sin(angle) * radius + centerOffset+65;

//             return (
//               <motion.div
//                 key={i}
//                 className="absolute text-center bg-white/80 backdrop-blur-md 
//                            text-[10px] sm:text-xs md:text-sm text-pink-700 font-semibold 
//                            px-2 py-1 rounded-full border border-pink-300 shadow-lg z-20"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1, x, y }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{
//                   delay: i * 0.1,
//                   type: "spring",
//                   stiffness: 120,
//                   damping: 8,
//                 }}
//               >
//                 <p className="font-bold">{item.date}</p>
//                 <p>{item.event}</p>
//               </motion.div>
//             );
//           })}
//       </AnimatePresence>

//       {/* 🩷 Hint */}
//       <p className="mt-25 text-xs text-pink-500 italic ">
//         {open ? "Tap to close memories 💭" : "Tap to open memories 💫"}
//       </p>
//     </div>
//   );
// }
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

  const radius = 160;
  const centerOffset = 10;
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
    <div className="relative flex flex-col items-center mt-32 px-4 sm:px-0">
      {/* 💖 Profile Circle */}
      <motion.div
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer w-48 h-48 rounded-full border-[4px] border-pink-300 
                   shadow-[0_0_25px_rgba(255,111,163,0.5)] bg-white/10 backdrop-blur-md 
                   flex justify-center items-center z-10"
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
        const y = Math.sin(angle) * radius + centerOffset + 65;

        return (
          <motion.div
            key={i}
            className="absolute text-center bg-white/80 text-[10px] sm:text-xs md:text-sm 
                       text-pink-700 font-semibold px-2 py-1 rounded-full border border-pink-300 shadow-lg z-20"
            animate={{
              x: open ? x : 0,
              y: open ? y : 0,
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
