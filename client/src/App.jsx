

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LockScreen from "./components/LockScreen";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Mood from "./pages/Mood"; 
import Chronicles from "./pages/Chronicles";
import SplitMoney from "./pages/SplitMoney";
import MorePage from "./pages/More";
import NotesPage from "./pages/NotesPage";
import MusicSection from "./pages/MusicPage";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {!user ? (
          // 🔒 If not logged in, always show LockScreen
           <Route path="*" element={<LockScreen onUnlock={(u) => setUser(u)} />} />

        ) : (
          <>
            {/* 🏠 Home page */}
            <Route path="/" element={<Home user={user} onLock={() => setUser(null)} />} />

            {/* 🖼 Gallery page */}
            <Route path="/gallery" element={<Gallery />} />

            {/* 💞 MoodVilla page */}
            <Route path="/mood" element={<Mood user={user} />} />

          {/* Chronicles page */}
           <Route path="/chronicles" element={<Chronicles username={user} />} />

           {/* Chronicles page */}
           <Route path="/split" element={<SplitMoney user={user} />} />

           {/* More Page */}
            <Route path="/more" element={<MorePage user={user} />} />

            {/* NotesPage */}
            <Route path="/notes" element={<NotesPage  user={user}/>} />

            {/* MusicPage */}
            <Route path="/music" element={<MusicSection user={user} />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}


