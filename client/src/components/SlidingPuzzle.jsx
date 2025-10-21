import React, { useState, useEffect } from "react";

export default function SlidingPuzzle() {
  const gridSize = 4;
  const [tiles, setTiles] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  // your images (in public folder)
  const puzzleImages = ["/puzzle1.jpg", "/puzzle2.jpg", "/puzzle3.jpg","/puzzle4.jpg"];

  // shuffle helper
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // initialize puzzle on load
  useEffect(() => {
    const arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    setImage(randomImage);
    setTiles(shuffleArray(arr));
  }, []);

  const resetPuzzle = (newImage) => {
    const arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    setImage(newImage);
    setTiles(shuffleArray(arr));
    setMessage("");
  };

  const handleTileClick = (index) => {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - gridSize,
      emptyIndex + gridSize,
    ];
    if (!validMoves.includes(index)) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);

    if (isSolved(newTiles)) {
      setMessage("Perfect Match 💞");
      setTimeout(() => {
        setMessage("");
        const arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
        setTiles(shuffleArray(arr));
      }, 3000);
    }
  };

  const isSolved = (arr) => arr.every((val, i) => val === i);

  return (
    <div className="bg-white/70 rounded-xl p-3 border border-white/20 shadow-md flex flex-col items-center w-100">
      <p className="text-xs text-zinc-900 mb-2 font-sans">Solve the Love Puzzle 💕</p>

      {/* 🧩 Puzzle Grid */}
      {image && (
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: "80%",
            aspectRatio: "1/1",
          }}
        >
          {tiles.map((tile, index) => {
            const row = Math.floor(tile / gridSize);
            const col = tile % gridSize;
            const size = 100 / (gridSize - 1);

            return (
              <div
                key={index}
                onClick={() => handleTileClick(index)}
                className={`rounded-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                  tile === 0 ? "bg-transparent" : ""
                }`}
                style={{
                  backgroundImage: tile !== 0 ? `url(${image})` : "none",
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${col * size}% ${row * size}%`,
                  width: "100%",
                  aspectRatio: "1 / 1",
                }}
              />
            );
          })}
        </div>
      )}

      {/* 🖼️ Image Selector */}
      <div className="flex gap-2 mt-3">
        {puzzleImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Puzzle ${i + 1}`}
            onClick={() => resetPuzzle(img)}
            className={`w-12 h-12 rounded-md cursor-pointer object-cover border-2 ${
              image === img ? "border-pink-500" : "border-transparent"
            } hover:opacity-80 transition`}
          />
        ))}
      </div>

      {message && (
        <p className="text-sm text-teal-700 mt-2 font-semibold animate-pulse">{message}</p>
      )}
    </div>
  );
}