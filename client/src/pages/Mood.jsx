// import { useState, useEffect } from "react";
// import axios from "axios";
// import MoodVilla from "./MoodVilla";
// import { USERS } from "../config/authConfig";

// // Map mood labels (text stored in DB) to GIFs
// const moodGifs = {
//   Happy: "/gifs/happy.gif",
//   Sad: "/gifs/sad.gif",
//   Melting: "gifs/melting.gif",
//   Angry: "/gifs/angry.gif",
//   Romantic: "/gifs/romantic.gif",
//   Sleepy: "/gifs/sleepy.gif",
//   Cool: "/gifs/cool.gif",
//   Thinking: "/gifs/thinking.gif",
//   Loved: "/gifs/loved.gif",
//   Playful: "/gifs/playful.gif",
//   "Missing You": "/gifs/missingyou.gif",
//   Calm: "/gifs/calm.gif",
//   Excited: "/gifs/excited.gif",
//   Nervous: "/gifs/nervous.gif",
//   Shocked: "/gifs/shocked.gif",
//   Tired: "/gifs/tired.gif",
//   Confused: "/gifs/confused.gif",
//   Mind_Blown: "/gifs/mindblown.gif" ,
//   Hugging: "/gifs/hugging.gif" ,
//   Blessed: "/gifs/blessed.gif" ,
//   Hungry: "/gifs/hungry.gif", 
//   Grateful: "/gifs/grateful.gif",

// };

// export default function Mood({ username }) {
//   const [myMood, setMyMood] = useState(null);
//   const [partnerMood, setPartnerMood] = useState(null);
//   const [showMoodVilla, setShowMoodVilla] = useState(false);

//   const API_BASE = "http://localhost:5000";
//   const partner = USERS.find((u) => u.username !== username);

//   const fetchMoods = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/moods`);
//       const data = res.data;

//       const my = data.find((m) => m.user === username);
//             const partnerData = partner ? data.find((m) => m.user === partner.username) : null;

//       setMyMood(my || null);
//       setPartnerMood(partnerData || null);
//     } catch (err) {
//       console.error("Error fetching moods:", err);
//     }
//   };
//   console.log("Mood received username:", username);

  
//   useEffect(() => {
//     fetchMoods();
//     const interval = setInterval(fetchMoods, 5000);
//     return () => clearInterval(interval);
//   }, [username]);

//   if (showMoodVilla) {
//     return <MoodVilla username={username} onBack={() => setShowMoodVilla(false)} />;
//   }

//   const getMoodGif = (moodLabel) => moodGifs[moodLabel] || "/gifs/default.gif";


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-blue-100 flex flex-col items-center justify-center p-6">
//       <h1 className="text-4xl font-extrabold text-pink-600 mb-10">💞 Mood Show 💞</h1>

//       <div className="flex flex-col md:flex-row gap-10">
//         {/* My Card */}
//         <div className="w-72 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col items-center border border-pink-300">
//           <h2 className="text-2xl font-bold text-pink-700 mb-3">
//             {username.name}
//           </h2>

//           {myMood?.mood ? (
//             <img
//               src={getMoodGif(myMood.mood)}
//               alt={myMood.mood}
//               className="w-40 h-40 object-cover rounded-2xl shadow-md mb-4"
//             />
//           ) : (
//             <div className="text-6xl mb-4 font-sans text-black">How are you feeling right now?</div>
//           )}

//           {myMood?.reason && (
//             <p className="text-gray-600 italic text-center mb-4">"{myMood.reason}"</p>
//           )}

//           <button
//             onClick={() => setShowMoodVilla(true)}
//             className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all"
//           >
//             Change Mood 💫
//           </button>
//         </div>

//         {/* Partner Card */}
//         <div className="w-72 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col items-center border border-blue-300">
//           <h2 className="text-2xl font-bold text-blue-700 mb-3">
//             {partner ? partner.name : "Partner 😶"}
//           </h2>

//           {partnerMood?.mood ? (
//             <img
//               src={getMoodGif(partnerMood.mood)}
//               alt={partnerMood.mood}
//               className="w-40 h-40 object-cover rounded-2xl shadow-md mb-4"
//             />
//           ) : (
//             <div className="text-6xl mb-4 font-sans">How are you feeling right now?</div>
//           )}

//           {partnerMood?.reason && (
//             <p className="text-gray-600 italic text-center mb-4">"{partnerMood.reason}"</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Mood.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import MoodVilla from "./MoodVilla";
import { USERS } from "../config/authConfig";

// Map mood labels (text stored in DB) to GIFs
const moodGifs = {
  Happy: "/gifs/happy.gif",
  Sad: "/gifs/sad.gif",
  Angry: "/gifs/angry.gif",
  Romantic: "/gifs/romantic.gif",
  Sleepy: "/gifs/sleepy.gif",
  Cool: "/gifs/cool.gif",
  Thinking: "/gifs/thinking.gif",
  Loved: "/gifs/loved.gif",
  Playful: "/gifs/playful.gif",
  "Missing You": "/gifs/missingyou.gif",
  Calm: "/gifs/calm.gif",
  Excited: "/gifs/excited.gif",
  Nervous: "/gifs/nervous.gif",
  Shocked: "/gifs/shocked.gif",
  Tired: "/gifs/tired.gif",
  Confused: "/gifs/confused.gif",
  "Mind Blown": "/gifs/mindblown.gif",
  Hugging: "/gifs/hugging.gif",
  Blessed: "/gifs/blessed.gif",
  Hungry: "/gifs/hungry.gif",
  Grateful: "/gifs/grateful.gif",
  default: "/gifs/default.gif",
};

export default function Mood({ user }) {
  const [myMood, setMyMood] = useState(null);
  const [partnerMood, setPartnerMood] = useState(null);
  const [showMoodVilla, setShowMoodVilla] = useState(false);

  const API_BASE = "http://localhost:5000";

  // Dynamically get partner object from USERS
  const partner = USERS.find((u) => u.username !== user.username);

  const fetchMoods = async () => {
    try {
      const res = await axios.get(`${API_BASE}/moods`);
      const data = res.data;

      const my = data.find((m) => m.user === user.username);
      const partnerData = partner ? data.find((m) => m.user === partner.username) : null;

      setMyMood(my || null);
      setPartnerMood(partnerData || null);
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  };

  useEffect(() => {
    fetchMoods();
    const interval = setInterval(fetchMoods, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (showMoodVilla) {
    return <MoodVilla user={user} onBack={() => setShowMoodVilla(false)} />;
  }

  const getMoodGif = (moodLabel) => moodGifs[moodLabel] || moodGifs.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-10">💞 Mood Show 💞</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* My Card */}
        <div className="w-72 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col items-center border border-pink-300">
          <h2 className="text-2xl font-bold text-pink-700 mb-3">{user.username}</h2>

          {myMood?.mood ? (
            <img
              src={getMoodGif(myMood.mood)}
              alt={myMood.mood}
              className="w-40 h-40 object-cover rounded-2xl shadow-md mb-4"
            />
          ) : (
            <div className="text-6xl mb-4">🤍</div>
          )}

          {myMood?.reason && (
            <p className="text-gray-600 italic text-center mb-4">"{myMood.reason}"</p>
          )}

          <button
            onClick={() => setShowMoodVilla(true)}
            className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all"
          >
            Change Mood 💫
          </button>
        </div>

        {/* Partner Card */}
        <div className="w-72 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col items-center border border-blue-300">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            {partner ? partner.username : "Partner ❤️"}
          </h2>

          {partnerMood?.mood ? (
            <img
              src={getMoodGif(partnerMood.mood)}
              alt={partnerMood.mood}
              className="w-40 h-40 object-cover rounded-2xl shadow-md mb-4"
            />
          ) : (
            <div className="text-6xl mb-4">🤍</div>
          )}

          {partnerMood?.reason && (
            <p className="text-gray-600 italic text-center mb-4">"{partnerMood.reason}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
