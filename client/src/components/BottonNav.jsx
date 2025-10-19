import React from "react";
import { FaHome, FaImage, FaRegSmile, FaBook, FaMoneyBillWave, FaEllipsisH } from "react-icons/fa";

export default function BottomNav({ currentPage, onChangePage }) {
  const buttons = [
    { name: "Home", label: "Home", icon: <FaHome /> },
    { name: "Gallery", label: "Gallery", icon: <FaImage /> },
    { name: "Mood", label: "Mood", icon: <FaRegSmile /> },
    { name: "Chronicles", label: "Chronicles", icon: <FaBook /> },
{ name: "SplitMoney", label: "Split", icon: <FaMoneyBillWave /> },
    { name: "More", label: "More", icon: <FaEllipsisH /> },
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="w-full max-w-md mx-4 bg-white/8 backdrop-blur-sm rounded-full p-2 flex items-center justify-between border border-white/10 shadow-lg">
        {buttons.map((btn) => (
          <button
            key={btn.name}
            onClick={() => onChangePage(btn.name)}
            className={`flex flex-col items-center text-xs transition-all cursor-pointer ${
              currentPage === btn.name ? "text-[#FF6FA3]" : "text-zinc-700"
            }`}
          >
            <div className="text-lg">{btn.icon}</div>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
