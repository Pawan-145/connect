import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./GalleryBowl.css";

const GalleryBowl = () => {
  const [IMAGES, setIMAGES] = useState([]);
  const [pool, setPool] = useState([]);
  const [servedImages, setServedImages] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("normal"); // normal, pin, delete
  const [selectedToDelete, setSelectedToDelete] = useState(new Set());
//   const [pinnedImages, setPinnedImages] = useState([]); 
// const [rotate, setRotate] = useState(false);

  const [serving, setServing] = useState(false);
  const stackRef = useRef(null);
  const serveTimerRef = useRef(null);
  const STACK_THUMB_W = 98;
  const STACK_THUMB_H = 66;
  const SERVE_INTERVAL = 400;

  
  // 🔹 Fetch images
  const fetchImages = async () => {
    try {
      const res = await axios.get("https://sharing-secrets-2.onrender.com/images");
      const urls = res.data.map(img => ({ url: img.secure_url, public_id: img.public_id }));
      setIMAGES(urls);
      setPool(urls.map(i => i.url));
      setServedImages(urls.map(i => i.url));
      setTimeout(() => createStack(urls.map(i => i.url)), 100);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    window.addEventListener("resize", () => createStack(pool));
    return () => window.removeEventListener("resize", () => createStack(pool));
  }, []);

  // 🔹 Shuffle
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function reshuffle() {
    const shuffled = shuffle(IMAGES.map(i => i.url));
    setPool(shuffled);
    setServedImages([]);
    setTimeout(() => createStack(shuffled), 50);
  }

  // 🔹 Create stack
  function createStack(images = pool) {
    const stack = stackRef.current;
    if (!stack) return;
    stack.innerHTML = "";
    const rect = stack.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    images.forEach((imgUrl, i) => {
      const el = document.createElement("img");
      el.className = "thumb";
      el.src = imgUrl + "?auto=compress&w=400&h=300";
      el.alt = "Thumbnail " + (i + 1);
      const left = Math.random() * (W - STACK_THUMB_W);
      const top = Math.random() * (H - STACK_THUMB_H);
      const rot = (Math.random() * 40 - 20).toFixed(1);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.transform = `rotate(${rot}deg) scale(${0.9 + Math.random() * 0.2})`;
      el.style.zIndex = 10 + i;

      el.addEventListener("click", ev => {
        ev.stopPropagation();
        if (mode === "pin") handlePin(imgUrl);
        else if (mode === "delete") handleSelectDelete(imgUrl);
        else serveOne(imgUrl);
      });
      stack.appendChild(el);
    });
  }

  // 🔹 Serving animation
  function startServing() {
    if (serving) return;
    setServing(true);
    let servedCount = 0;
    serveTimerRef.current = setInterval(() => {
      if (servedCount >= IMAGES.length) {
        stopServing();
        return;
      }
      const next = pool[servedCount % pool.length];
      serveOne(next);
      servedCount++;
    }, SERVE_INTERVAL);
  }

  function stopServing() {
    setServing(false);
    if (serveTimerRef.current) clearInterval(serveTimerRef.current);
  }

  function serveOne(imgUrl) {
    setServedImages(prev => [...prev, imgUrl]);
  }

  // 🔹 Upload
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await axios.post("https://sharing-secrets-2.onrender.com/upload", formData);
      await fetchImages();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  // 🔹 Delete
  function handleSelectDelete(imgUrl) {
    const newSet = new Set(selectedToDelete);
    if (newSet.has(imgUrl)) newSet.delete(imgUrl);
    else newSet.add(imgUrl);
    setSelectedToDelete(newSet);
  }

async function handleDeleteSelected() {
  const selectedIds = IMAGES.filter(i => selectedToDelete.has(i.url)).map(i => i.public_id);
  try {
    await Promise.all(
      selectedIds.map(id =>
        axios.delete(`https://sharing-secrets-2.onrender.com/delete/${encodeURIComponent(id)}`)
      )
    );
    setSelectedToDelete(new Set());
    await fetchImages();
    setMode("normal");
  } catch (err) {
    console.error("Delete failed:", err);
  }
}


//   // 🔹 Pin
//   function handlePin(imgUrl) {
//     setPinnedImages(prev => {
//       if (prev.includes(imgUrl)) return prev.filter(i => i !== imgUrl); // unpin
//       return [imgUrl, ...prev]; // pin on top
//     });
//   }

  // 🔹 Displayed images with pinned on top
 // 🔹 Displayed images
const pinnedImages = []; // temporary empty array
const uniqueServed = Array.from(new Set(servedImages));
const displayedImages = uniqueServed;

// Dummy handlePin to avoid undefined error
function handlePin(imgUrl) {
  console.log("Pin clicked:", imgUrl);
}
  return (
    <section className="gallery-bowl-section">
      <div className="wrap">
        {/* Bowl area */}
        <div className="bowl-area">
          <div className="bowl-title">Gallery Bowl
          
           <label className="btn bg-zinc-800 text-white" style={{ cursor: "pointer" }}>
              Upload
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
             
            {uploading && <div className="muted text-pink-500">Uploading...</div>}
            </div>
            <div className="font-sans text-red-400">(1) If bowl not showing images and causing render problems, use Reshuffle button </div>
            <span className="font-sans text-red-900">(2) Upload and Delete may take time. So please wait </span>
          <div className="bowl-wrap">
            <div
              id="bowl"
              className={`bowl ${serving ? "active" : ""}`}
              onClick={() => (serving ? stopServing() : startServing())}
            >
              <svg viewBox="0 0 360 220" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#3a4756" />
                    <stop offset="1" stopColor="#252f3a" />
                  </linearGradient>
                  <radialGradient id="rim" cx="50%" cy="30%" r="60%">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.06" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0.00" />
                  </radialGradient>
                </defs>
                <ellipse cx="180" cy="200" rx="120" ry="18" fill="rgba(0,0,0,0.45)" />
                <path
                  d="M40 70 C40 30,320 30,320 70 C320 120,260 165,180 165 C100 165,40 120,40 70 Z"
                  fill="url(#g1)"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
                <path
                  d="M58 74 C58 42,302 42,302 74 C302 90,260 120,180 120 C100 120,58 90,58 74 Z"
                  fill="url(#rim)"
                />
                <circle cx="76" cy="52" r="3.6" fill="#ffd166" opacity="0.9" />
              </svg>

              <div ref={stackRef} id="stack" style={{ position: "absolute", inset: "26px 32px 28px 32px" }} />
            </div>
          </div>

          <div className="controls flex gap-2 flex-wrap">
            <button className="btn" onClick={startServing}>Serve Images</button>
            <button className="btn" onClick={reshuffle}>Reshuffle</button>
            {/* <button
              className={`btn ${mode === "pin" ? "bg-teal-500 text-white" : ""}`}
              onClick={() => setMode(mode === "pin" ? "normal" : "pin")}
            >
              Pin Mode
            </button> */}
            <button
              className={`btn ${mode === "delete" ? "bg-red-500 text-white" : ""}`}
              onClick={() => setMode(mode === "delete" ? "normal" : "delete")}
            >
              Delete Mode
            </button>

            {mode === "delete" && selectedToDelete.size > 0 && (
              <button className="btn bg-red-700 text-white" onClick={handleDeleteSelected}>
                Delete Selected ({selectedToDelete.size})
              </button>
            )}

            {/* <label className="btn" style={{ cursor: "pointer" }}>
              Upload
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label> */}

            {uploading && <div className="muted text-teal-500">Uploading...</div>}
          </div>
        </div>

        {/* Served Images */}
        <div className="served-area">
          <div className="served-title">Served Images</div>
          <div className="served-canvas flex flex-wrap justify-center gap-4 p-4 transition-all duration-500">
            {displayedImages.map((imgUrl, i) => (
              <div key={i} className="relative group">
                <img
                  src={imgUrl + "?auto=compress&w=600&h=400"}
                  alt="Served"
                  className={`rounded-lg object-cover shadow-lg border cursor-pointer hover:scale-105 transition-transform duration-300 ${
                    pinnedImages.includes(imgUrl) ? "border-teal-400 border-4" : "border-white/5"
                  }`}
                  style={{
                    width: `${Math.max(160 - servedImages.length * 4, 100)}px`,
                    height: `${Math.max(110 - servedImages.length * 3, 80)}px`,
                  }}
                  onClick={() => {
                    if (mode === "normal") setLightboxImg(imgUrl);
                    else if (mode === "pin") handlePin(imgUrl);
                    else if (mode === "delete") handleSelectDelete(imgUrl);
                  }}
                />
                {mode === "delete" && (
                  <input
                    type="checkbox"
                    className="absolute bottom-2 right-2 opacity-80 w-4 h-4"
                    checked={selectedToDelete.has(imgUrl)}
                    onChange={() => handleSelectDelete(imgUrl)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div className="lightbox show" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} className="lb-img" alt="Large view" />
          <button className="close-x" onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}
    </section>
  );
};

export default GalleryBowl;
