// src/components/ThoughtOfDay.jsx
import React from "react";
import { motion } from "framer-motion";

/* Romantic thoughts pool — you can change or rotate via API/local list */
const THOUGHTS = [
  "Thought of the day: Love grows louder in small moments. 💕",
  "Thought of the day: Hold hands like you'll never let go. 🤝",
  "Thought of the day: Cook a tiny surprise tonight — love is in the little things. 🍲",
  "Thought of the day: Say ‘I love you’ in your favourite language today. 🌍",
];

export default function ThoughtOfDay() {
  const idx = Math.floor(Math.random() * THOUGHTS.length);
  const text = THOUGHTS[idx];

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-3 bg-[#FFC1CC]/40 border border-white/10"
    >
      <p className="text-sm text-white font-medium">{text}</p>
    </motion.div>
  );
}
