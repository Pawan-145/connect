import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStickyNote, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPage({ user }) {
  const navigate = useNavigate();
  if (!user) navigate("/more");

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewNote, setViewNote] = useState(null); // note popup
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");

  const MAX_PREVIEW_LENGTH = 100;
  const API_URL = "https://sharing-secrets-2.onrender.com/api/notes";
  const socket = io("https://sharing-secrets-2.onrender.com/");

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(API_URL);
        setNotes(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch notes:", err);
      }
    };
    fetchNotes();
  }, []);

  // Real-time updates
  useEffect(() => {
    socket.on("note-update", (note) => {
      setNotes((prev) => {
        const exists = prev.find((n) => n._id === note._id);
        if (exists) return prev.map((n) => (n._id === note._id ? note : n));
        return [note, ...prev];
      });
    });

    socket.on("note-delete", (id) => {
      setNotes((prev) => prev.filter((n) => n._id !== id));
    });

    return () => socket.disconnect();
  }, []);

  // Add note
  const addNote = async () => {
    if (!newNote) return;
    const tempId = Date.now().toString();
    const tempNote = { _id: tempId, username: user.username, text: newNote };
    setNotes((prev) => [tempNote, ...prev]);
    setNewNote("");
    setShowForm(false);

    try {
      const res = await axios.post(API_URL, { username: user.username, text: newNote });
      setNotes((prev) => prev.map((n) => (n._id === tempId ? res.data : n)));
    } catch (err) {
      console.error("❌ Failed to add note:", err);
      setNotes((prev) => prev.filter((n) => n._id !== tempId));
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      console.error("❌ Failed to delete note:", err);
    }
  };

  // Save note
  const saveNote = async (noteId, newText) => {
    try {
      const res = await axios.put(`${API_URL}/${noteId}`, { text: newText });
      setNotes((prev) => prev.map((note) => (note._id === noteId ? res.data : note)));
      setEditingNote(null);
    } catch (err) {
      console.error("❌ Failed to update note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-teal-50 flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-pink-200 hover:bg-pink-300 text-teal-700 shadow-md"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
          <FaStickyNote /> Notes
        </h1>
      </header>

      {/* Add Note Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-200 hover:bg-teal-300 text-pink-700 px-4 py-2 rounded-2xl shadow-md font-semibold"
        >
          <FaPlus /> Add Note
        </button>
      </div>

      {/* Add Note Form */}
      {showForm && (
        <div className="mb-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-pink-100">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-3 rounded-xl border border-teal-200 focus:ring-2 focus:ring-pink-300 text-gray-800"
          />
          <button
            onClick={addNote}
            className="mt-2 w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-xl font-semibold"
          >
            Save Note
          </button>
        </div>
      )}

      {/* Notes List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 max-h-[70vh]">

        {notes.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No notes yet 📝</p>
        ) : (
          notes.map((note) => {
            const isOwner = note.username === user.username;
            const displayText =
              note.text.length > MAX_PREVIEW_LENGTH
                ? note.text.slice(0, MAX_PREVIEW_LENGTH) + "..."
                : note.text;

            return (
              <div
                key={note._id}
                className="flex flex-col bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-teal-100 cursor-pointer"
                onClick={() => setViewNote(note)}
              >
                <p className="text-gray-500 text-sm">Created by: {note.username}</p>
                <p className="text-gray-800">{displayText}</p>
                {note.text.length > MAX_PREVIEW_LENGTH && (
                  <span className="text-teal-600 text-sm hover:underline">
                    View More
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* View Note Modal */}
      <AnimatePresence>
        {viewNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setViewNote(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 w-80 sm:w-96 shadow-xl border border-teal-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-teal-700 mb-4 text-center">
                Note by {viewNote.username} 📝
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap">{viewNote.text}</p>

              {/* Owner actions */}
              {viewNote.username === user.username && (
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingNote(viewNote);
                      setEditText(viewNote.text);
                      setViewNote(null);
                    }}
                    className="flex-1 bg-teal-200 hover:bg-teal-300 py-2 rounded-xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteNote(viewNote._id);
                      setViewNote(null);
                    }}
                    className="flex-1 bg-red-200 hover:bg-red-300 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                onClick={() => setViewNote(null)}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-xl"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Note Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 w-80 sm:w-96 shadow-xl border border-teal-100"
            >
              <h2 className="text-xl font-bold text-teal-700 mb-4 text-center">
                Edit Note ✏️
              </h2>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 rounded-xl border border-teal-200 focus:ring-2 focus:ring-pink-300 text-gray-800"
              />
              <div className="flex justify-between gap-2 mt-4">
                <button
                  onClick={() => setEditingNote(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveNote(editingNote._id, editText)}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  <motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 80, damping: 12 }}
  className="mt-auto w-full h-24 bg-gradient-to-t from-teal-200 via-pink-100 to-rose-50 rounded-t-3xl shadow-inner flex flex-col items-center justify-center"
>
  <motion.p
    animate={{ y: [0, -5, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="text-teal-700 font-semibold text-lg"
  >
    📝 Keep your thoughts flowing!
  </motion.p>

  {/* Animated underline */}
  <motion.div
    className="mt-1 h-1 w-20 bg-teal-700 rounded-full"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }}
  />
</motion.div>




    </div>
  );
}
