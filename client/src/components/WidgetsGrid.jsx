// src/components/WidgetsGrid.jsx
import React from "react";
import { FaImage, FaRegSmile, FaCalendarAlt, FaGavel, FaMapMarkerAlt, FaFeatherAlt } from "react-icons/fa";

function Widget({ title, subtitle, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/8 rounded-2xl p-3 cursor-pointer hover:scale-[1.01] transition-transform border border-white/10"
    >
      <div className="flex items-start gap-3 bg-white rounded-2xl">
        <div className="p-2 rounded-lg bg-white/8">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semiboldtext-zinc-900 font-sans">{title}</div>
          <div className="text-xs text-zinc-900 font-sans mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetsGrid({ pinned }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-zinc-900 font-sans ">
      <Widget
        title="Pinned Images"
        subtitle={`${(pinned.images || []).length} photos`}
        icon={<FaImage className="text-pink-200" />}
        onClick={() => alert("Open Gallery")}
      />
      <Widget
        title="Current Mood"
        subtitle={pinned.mood || "—"}
        icon={<FaRegSmile className="text-[#FF6FA3]" />}
        onClick={() => alert("Open Mood")}
      />
      <Widget
        title="Events"
        subtitle={`${(pinned.events || []).length} upcoming`}
        icon={<FaCalendarAlt className="text-teal-200" />}
        onClick={() => alert("Open Chronicles -> Events")}
      />
      <Widget
        title="Punishments"
        subtitle={`${(pinned.punishments || []).length}`}
        icon={<FaGavel className="text-[#FF9AA2]" />}
        onClick={() => alert("Open Chronicles -> Punishments")}
      />
      <Widget
        title="Promises"
        subtitle={`${(pinned.promises || []).length}`}
        icon={<FaFeatherAlt className="text-pink-100" />}
        onClick={() => alert("Open Chronicles -> Promises")}
      />
      <Widget
        title="Location"
        subtitle={pinned.location?.distance || "—"}
        icon={<FaMapMarkerAlt className="text-teal-300" />}
        onClick={() => alert("Open Location")}
      />
      <div className="col-span-2">
        <Widget
          title="Poems & Messages"
          subtitle={`${(pinned.poems || []).length} items`}
          icon={<FaRegSmile className="text-pink-200" />}
          onClick={() => alert("Open More -> Poems")}
        />
      </div>
    </div>
  );
}
