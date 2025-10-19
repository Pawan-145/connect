
import React, { useState } from "react";
import HomePage from "./HomePage";
import Gallery from "./Gallery";
import Mood from "./Mood";
import Chronicles from "./Chronicles";
import More from "./More";
import BottomNav from "../components/BottonNav";
import SplitMoney from "./SplitMoney";
export default function Home({ user, onLock }) {
  const [currentPage, setCurrentPage] = useState("Home");

  let PageComponent;
  switch (currentPage) {
    case "Gallery":
      PageComponent = <Gallery />;
      break;
    case "Mood":
       PageComponent = <Mood user={user} />;
      break;
    case "Chronicles":
      PageComponent = <Chronicles />;
      break;
    case "SplitMoney":
      PageComponent = <SplitMoney user={user}/>;
      break;
    case "More":
      PageComponent = <More />;
      break;
    default:
      PageComponent = <HomePage user={user} onLock={onLock} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1] font-sans text-white">
      {PageComponent}
      <BottomNav currentPage={currentPage} onChangePage={setCurrentPage} />
    </div>
  );
}
