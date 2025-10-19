import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaCheck, FaStickyNote, FaThumbtack, FaTrash, FaArrowLeft, FaHeadphones } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Change to deployed server URL

export default function MusicPage({ user }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [isListeningTogether, setIsListeningTogether] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const audioRef = useRef(null);

  const username = user?.username || "Unknown";

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const hardcodedSongs = [
    { title: "Mast Magan", url: "/songs/Mast_Magan.mp3" },
    { title: "In Dino", url: "/songs/In_Dino.mp3" },
    { title: "Saajan Ve", url: "/songs/Saajan_Ve.mp3" },
    { title: "Barbaad (from Saiyaara)", url: "/songs/Barbaad_Saiyaara.mp3" },
    { title: "Humnava Mere (Jubin Nautiyal)", url: "/songs/Humnava_Mere.mp3" },
    { title: "Tum Ho Toh (Saiyaara)", url: "/songs/Tum_Ho_Toh.mp3" },
    { title: "Chitta (Shiddat)", url: "/songs/Chitta_Shiddat.mp3" },
    { title: "Zaroor", url: "/songs/Zaroor.mp3" },
    { title: "Zaalima", url: "/songs/Zaalima.mp3" },
    { title: "Main Tumhara (Dil Bechara)", url: "/songs/Main_Tumhara_Dil_Bechara.mp3" },
    { title: "Qaafirana (Kedarnath)", url: "/songs/Qaafirana.mp3" },
    { title: "Humsafar", url: "/songs/Humsafar.mp3" },
    { title: "Nazm Nazm (Bareilly Ki Barfi)", url: "/songs/Nazm_Nazm.mp3" },
    { title: "Iktara (Wake Up Sid)", url: "/songs/Iktara.mp3" },
    { title: "Tera Ban Jaunga (Kabir Singh)", url: "/songs/Tera_Ban_Jaunga.mp3" },
    { title: "Saiyaara", url: "/songs/Saiyaara.mp3" },
    { title: "O Rangrez (Bhaag Milkha Bhaag)", url: "/songs/O_Rangrez.mp3" },
    { title: "Junoon", url: "/songs/Junoon.mp3" },
    { title: "Dooron Dooron (Unplugged)", url: "/songs/Dooron_Dooron.mp3" },
    { title: "Satranga (Animal)", url: "/songs/Satranga.mp3" },
    { title: "Raanjhan (from \"Do Patti\")", url: "/songs/Raanjhan.mp3" },
    { title: "Botalaan (Paresh Pahuja)", url: "/songs/Botalaan.mp3" },
    { title: "Mitwa", url: "/songs/Mitwa.mp3" },
    { title: "Ishq Hai", url: "/songs/Ishq_Hai.mp3" },
    { title: "Dhun (Saiyaara)", url: "/songs/Dhun.mp3" },
    { title: "Humsafar (from \"Saiyaara\")", url: "/songs/Humsafar_Saiyaara.mp3" },
  ];

  const fetchNotes = async () => {
    try {
      const notesRes = await axios.get("http://localhost:5000/musicnotes");
      const mergedSongs = hardcodedSongs.map((song) => {
        const note = notesRes.data.find((n) => n.title === song.title);
        return {
          ...song,
          _id: note?._id || null,
          note: note?.note || "",
          noteBy: note?.noteBy || "",
          pinned: note?.pinned || false,
          pinnedBy: note?.pinnedBy || "",
          done: note?.done || false,
        };
      });
      setSongs(mergedSongs);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    socket.on("currentSong", ({ songUrl, title }) => {
      if (isListeningTogether && songUrl) {
        setCurrentSong(songUrl);
        if (audioRef.current) {
          audioRef.current.src = songUrl;
          audioRef.current.play();
        }
        showToast(`🎵 Partner is listening to: ${title}`);
      }
    });

    socket.on("partnerPauseSong", () => {
      if (isListeningTogether && audioRef.current) audioRef.current.pause();
    });

    socket.on("partnerResumeSong", () => {
      if (isListeningTogether && audioRef.current) audioRef.current.play();
    });

    return () => {
      socket.off("currentSong");
      socket.off("partnerPauseSong");
      socket.off("partnerResumeSong");
    };
  }, [isListeningTogether]);

  const handlePlaySong = (song) => {
    setCurrentSong(song.url);
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.play();
    }
    if (isListeningTogether) socket.emit("playSong", { songUrl: song.url, title: song.title, username });
  };

  const handlePause = () => {
    if (audioRef.current) audioRef.current.pause();
    if (isListeningTogether) socket.emit("pauseSong", { username });
  };

  const handleResume = () => {
    if (audioRef.current) audioRef.current.play();
    if (isListeningTogether) socket.emit("resumeSong", { username });
  };

  const openNoteModal = (song) => {
    setSelectedSong(song);
    setNoteText(song.note || "");
    if (song.note && song.noteBy !== username) {
      showToast(`Only ${song.noteBy} can edit this note 💖`);
    }
    setShowNoteModal(true);
  };

  const saveNote = async () => {
    if (selectedSong.note && selectedSong.noteBy !== username) {
      showToast(`You can't edit ${selectedSong.noteBy}'s note 💌`);
      return;
    }
    try {
      const payload = { title: selectedSong.title, note: noteText, noteBy: username };
      let updatedSong;
      if (selectedSong._id) {
        const res = await axios.put(`http://localhost:5000/musicnotes/${selectedSong._id}`, payload);
        updatedSong = res.data;
      } else {
        const res = await axios.post(`http://localhost:5000/musicnotes`, payload);
        updatedSong = res.data;
      }
      setSongs((prev) =>
        prev.map((s) => (s.title === selectedSong.title ? { ...s, ...updatedSong, _id: updatedSong._id } : s))
      );
      setShowNoteModal(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const deleteNote = async () => {
    if (!selectedSong._id || selectedSong.noteBy !== username) {
      showToast(`You can't delete ${selectedSong.noteBy}'s note 💌`);
      return setShowNoteModal(false);
    }
    try {
      await axios.put(`http://localhost:5000/musicnotes/${selectedSong._id}`, { note: "", noteBy: "" });
      setSongs((prev) =>
        prev.map((s) => (s.title === selectedSong.title ? { ...s, note: "", noteBy: "" } : s))
      );
      setShowNoteModal(false);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handlePinSong = async (song) => {
    try {
      if (song.pinned && song.pinnedBy !== username) {
        showToast(`Only ${song.pinnedBy} can unpin this 💌`);
        return;
      }
      let updatedSong;
      if (!song._id) {
        const res = await axios.post(`http://localhost:5000/musicnotes`, {
          title: song.title,
          pinned: true,
          pinnedBy: username,
          note: "",
          noteBy: "",
          done: false,
        });
        updatedSong = res.data;
      } else {
        const res = await axios.put(`http://localhost:5000/musicnotes/${song._id}`, {
          pinned: !song.pinned,
          pinnedBy: !song.pinned ? username : "",
        });
        updatedSong = res.data;
      }
      setSongs((prev) =>
        prev.map((s) => (s.title === song.title ? { ...s, ...updatedSong, _id: updatedSong._id } : s))
      );
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const filteredSongs = songs
    .filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-teal-50 flex items-center justify-center p-2 sm:p-4">
      {/* iPhone-style container */}
      <div className="w-full max-w-md h-[90vh] bg-white/90 backdrop-blur-md rounded-3xl shadow-xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="px-3 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-teal-700 truncate">🎵 Music</h1>
          </div>
          <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsListeningTogether(!isListeningTogether)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm ${isListeningTogether ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <FaHeadphones /> {isListeningTogether ? "Listening Together 🎧" : "Solo Mode"}
            </button>
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3">
          {filteredSongs.map((song) => (
            <motion.div
              key={song.title}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl shadow-md transition-all
                ${currentSong === song.url ? "bg-teal-100 scale-[1.02] border border-teal-400 shadow-lg" : song.pinned ? "bg-pink-100 border border-pink-300" : "bg-white/90"}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => currentSong === song.url ? handlePause() : handlePlaySong(song)}
                  className="p-2 bg-teal-200 hover:bg-teal-300 rounded-full text-pink-700 flex-shrink-0"
                >
                  {currentSong === song.url ? <FaPause /> : <FaPlay />}
                </button>
                <div className="flex flex-col">
                  <p className="font-semibold text-teal-700 flex flex-wrap items-center gap-1 text-sm sm:text-base">
                    {song.title}
                    {currentSong === song.url && <span className="text-xs sm:text-sm text-teal-600 font-semibold">(Playing...)</span>}
                    {song.pinned && <span className="text-xs sm:text-sm text-pink-600 font-semibold">(Today’s Pick 💌 — {song.pinnedBy})</span>}
                  </p>
                  {song.note && (
                    <p className="text-xs sm:text-sm text-pink-500 flex items-center gap-1">
                      <FaStickyNote /> <span><b>{song.noteBy}:</b> {song.note}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <button onClick={() => handlePinSong(song)} className={`text-pink-600 hover:text-pink-800 ${song.pinned ? "rotate-12" : ""}`}><FaThumbtack /></button>
                <button onClick={() => openNoteModal(song)} className="text-teal-700 hover:text-teal-900 text-sm sm:text-base">📝</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Audio Player */}
        {currentSong && (
          <div className="bg-gradient-to-t from-teal-200 via-pink-100 to-rose-50 p-3 flex flex-row items-center justify-between rounded-t-3xl shadow-inner">
            <p className="text-teal-700 font-semibold truncate w-1/3">Now Playing 🎵</p>
            <audio ref={audioRef} controls autoPlay src={currentSong} className="w-2/3 mx-2" />
            <button onClick={() => setCurrentSong(null)} className="text-red-500 font-bold">Cancel ❌</button>
          </div>
        )}

        {/* Note Modal & Toast */}
        <AnimatePresence>
          {showNoteModal && (
            <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-white rounded-3xl p-6 shadow-lg w-80 flex flex-col gap-3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <h2 className="text-xl font-bold text-teal-700 mb-2">🎵 {selectedSong?.title}</h2>
                <textarea rows="4" value={noteText} onChange={(e) => setNoteText(e.target.value)} className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Write a note 💖" />
                <div className="flex justify-between mt-3">
                  <button onClick={deleteNote} className="px-3 py-1 bg-rose-200 text-rose-700 rounded-xl flex items-center gap-1 hover:bg-rose-300"><FaTrash /> Delete</button>
                  <div className="flex gap-2">
                    <button onClick={() => setShowNoteModal(false)} className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300">Cancel</button>
                    <button onClick={saveNote} className="px-3 py-1 bg-teal-300 text-teal-900 rounded-xl hover:bg-teal-400">Save</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {toastMessage && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg text-sm">
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
