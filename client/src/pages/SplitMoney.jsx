import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaUser, FaUserFriends, FaTrash } from "react-icons/fa";
import { USERS } from "../config/authConfig";

const API_URL = "http://localhost:5000/api/expenses";

export default function CoupleSplit({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(user.username);

  const listRef = useRef(null);

  // Identify the partner
  const partner = USERS.find((u) => u.username !== user.username);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(API_URL);
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setExpenses(sorted);
      } catch (err) {
        console.error("❌ Failed to fetch expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  // Add expense
  const handleAddExpense = async () => {
    if (!title || !amount) return;

    try {
      // paidBy is actual username
      const newExpense = {
        title,
        amount: parseFloat(amount),
        paidBy,
      };
      const res = await axios.post(API_URL, newExpense);
      setExpenses([res.data, ...expenses]);
      setTitle("");
      setAmount("");
      setPaidBy(user.username);
      setShowModal(false);
    } catch (err) {
      console.error("❌ Add expense error:", err);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete expense:", err);
    }
  };

  // Calculate net balance relative to logged-in user
  const netBalance = expenses.reduce((acc, e) => {
    if (e.paidBy === user.username) return acc + e.amount / 2; // user paid → partner owes
    return acc - e.amount / 2; // partner paid → user owes
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 px-4 sm:px-6 py-6 flex flex-col items-center relative">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-6 text-center drop-shadow">
        💞 Couple Split
      </h1>

      {/* Net Balance Dashboard */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        {/* Add button */}
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -left-16 sm:-left-20 md:-left-24 bg-pink-500 cursor-pointer text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition"
        >
          <FaPlus className="text-2xl" />
        </motion.button>

        {/* Delete button */}
        <motion.button
          onClick={() => setDeleteMode(!deleteMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute -right-16 sm:-right-20 md:-right-24 ${
            deleteMode ? "bg-red-500" : "bg-gray-800"
          } text-white p-4 rounded-full shadow-lg hover:opacity-90 transition cursor-pointer`}
        >
          <FaTrash className="text-2xl" />
        </motion.button>

        {/* Net balance circle */}
        <motion.div
          className="w-40 h-40 relative flex flex-col items-center justify-center rounded-full shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
            <circle
              className={`${
                netBalance > 0
                  ? "text-pink-400"
                  : netBalance < 0
                  ? "text-teal-400"
                  : "text-gray-400"
              }`}
              strokeWidth="8"
              stroke="currentColor"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={
                2 * Math.PI * 70 * (1 - Math.min(Math.abs(netBalance) / 1000, 1))
              }
              strokeLinecap="round"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center px-2">
            {expenses.length === 0 ? (
              <span className="text-zinc-900 text-sm">No expenses 💸</span>
            ) : netBalance > 0 ? (
              <>
                <span className="text-sm text-zinc-900">
                  {partner.username} owes {user.username}
                </span>
                <span className="text-2xl font-bold text-pink-400">
                  ₹{netBalance.toFixed(2)}
                </span>
              </>
            ) : netBalance < 0 ? (
              <>
                <span className="text-sm text-zinc-900">
                  {user.username} owes {partner.username}
                </span>
                <span className="text-2xl font-bold text-teal-400">
                  ₹{Math.abs(netBalance).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-center">All settled ❤️</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Expense Table */}
      <div
        ref={listRef}
        className="w-full max-w-2xl text-zinc-900 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-y-auto border border-teal-100 flex-1"
        style={{ maxHeight: "60vh" }}
      >
        <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-2 bg-teal-100 font-bold text-teal-700 text-center">
          <span>Title</span>
          <span>Paid By</span>
          <span>Split</span>
          <span>Total</span>
          {deleteMode && <span>Action</span>}
        </div>

        <AnimatePresence>
          {expenses.map((e) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-4 py-3 border-b text-center text-sm sm:text-base items-center ${
                e.paidBy === user.username ? "bg-pink-50" : "bg-teal-50"
              }`}
            >
              <span className="font-semibold">{e.title}</span>
              <span>{e.paidBy}</span>
              <motion.span
                className="font-bold text-teal-700"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
              >
                ₹{(e.amount / 2).toFixed(2)}
              </motion.span>
              <span className="hidden sm:inline font-medium">₹{e.amount.toFixed(2)}</span>
              {deleteMode && (
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleDeleteExpense(e._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ❌
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 w-80 sm:w-96 shadow-xl border border-teal-100"
            >
              <h2 className="text-xl font-bold text-teal-700 mb-4 text-center">
                Add Expense 💰
              </h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Expense Title"
                className="w-full mb-3 p-3 rounded-xl border text-black border-teal-200 focus:ring-2 focus:ring-pink-300"
              />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                className="w-full mb-3 p-3 rounded-xl border text-black border-teal-200 focus:ring-2 focus:ring-pink-300"
              />

              <div className="flex justify-around mb-4">
                <button
                  onClick={() => setPaidBy(user.username)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                    paidBy === user.username
                      ? "bg-pink-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaUser /> {user.username}
                </button>
                <button
                  onClick={() => setPaidBy(partner.username)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                    paidBy === partner.username
                      ? "bg-teal-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaUserFriends /> {partner.username}
                </button>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
