// import { useState } from "react";
// import { USERS } from "../config/authConfig";
// export default function LockScreen({ onUnlock }) {
 
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = () => {
//     const user = USERS.find(
//       (u) => u.username.toLowerCase() === username.toLowerCase()
//     );
//     if (!user) return setError("Access Denied ❌");
//     if (password === user.password) {
//       onUnlock(user);
//     } else {
//       setError("Wrong Password 😢");
//     }
//   };

//   return (
//   <div
//     className="flex flex-col items-center justify-start h-screen font-sans bg-cover bg-center"
//     style={{
//       backgroundImage: "url('images/bg.jpg')",
//     }}
//   >
//     <div className="w-80  mt-24 p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/30">
//       <h2 className="text-2xl text-[#008080] font-bold text-center mb-6">
//         💞 Lock Screen 💞
//       </h2>

//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="w-full mb-4 p-3 rounded-xl bg-[#FFC1CC] text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-[#008080]"
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full mb-4 p-3 rounded-xl bg-[#FFC1CC] text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-[#008080]"
//       />

//       {error && (
//         <p className="text-center text-[#FF6F61] font-medium mb-3">{error}</p>
//       )}

//       <button
//         onClick={handleLogin}
//         className="w-full py-3 rounded-xl bg-[#008080] hover:bg-[#009999] cursor-pointer text-white font-semibold transition-all"
//       >
//         Unlock 💫
//       </button>
//     </div>
//   </div>
//   );
// }
import { useState } from "react";
import axios from "axios";

export default function LockScreen({ onUnlock }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://sharing-secrets-2.onrender.com/login", {
        username,
        password,
      });
      onUnlock(res.data); // res.data = { username: "..." }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-cover bg-center" style={{backgroundImage: "url('images/bg.jpg')"}}>
      <div className="w-80 mt-24 p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/30">
        <h2 className="text-2xl text-[#008080] font-bold text-center mb-6">💞 Lock Screen [Testing prototype] 💞</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-[#FFC1CC] text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-[#008080]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-[#FFC1CC] text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-[#008080]"
        />
        {error && <p className="text-center text-[#FF6F61] font-medium mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-[#008080] hover:bg-[#009999] cursor-pointer text-white font-semibold transition-all"
        >
          Unlock 💫
        </button>
      </div>
    </div>
  );
}
