// src/components/RelationshipBar.jsx
import React from "react";

/**
 * Shows two horizontal bars (you and partner) to judge current mood/score.
 * Values expected 0..100
 */
export default function RelationshipBar({ you = 50, partner = 50 }) {
  return (
    <div className="bg-white/6 rounded-xl p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-zinc-900 font-sans">Relationship State</p>
        <p className="text-xs text-zinc-900 font-sans">Higher is happier 😊</p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-900 font-sans">You</span>
            <span className="text-zinc-900 font-sans">{you}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${you}%`,
                background: "linear-gradient(90deg, #FF6FA3, #FFC1CC)",
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-black font-sans">Partner</span>
            <span className="text-zinc-900 font-sans">{partner}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${partner}%`,
                background: "linear-gradient(90deg, #4FD1C5, #008080)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
