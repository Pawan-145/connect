import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion";

export default function MorePage() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Notes",
      icon: <FaStickyNote size={24} />,
      bg: "from-pink-100 to-rose-200",
      iconColor: "text-pink-600",
      path: "/notes",
    },
    {
      title: "Music",
      icon: <FaMusic size={24} />,
      bg: "from-teal-100 to-cyan-200",
      iconColor: "text-teal-600",
      path: "/music",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-teal-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-teal-700 mt-6 mb-6 tracking-wide">
        More Options 💕
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {options.map((item, idx) => (
          <motion.div
            key={idx}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md shadow-md border border-pink-100 hover:bg-pink-50 transition-all duration-200 rounded-2xl p-4 cursor-pointer"
          >
            <motion.div
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${item.bg} shadow-sm`}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {React.cloneElement(item.icon, { className: item.iconColor })}
            </motion.div>
            <p className="text-lg font-semibold text-gray-800">{item.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
