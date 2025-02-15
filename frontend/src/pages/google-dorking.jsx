import React, { useState } from "react";
import buttonsData from "../api/dorking.json"; // Impor file JSON lokal

const GoogleDorking = () => {
  // Membagi data menjadi tiga bagian
  const leftSidebarData = buttonsData.slice(0, 14); // 14 item pertama
  const rightSidebarData = buttonsData.slice(14, 28); // 14 item berikutnya
  const gridButtonData = buttonsData.slice(28, 40); // 12 item sisanya

  const [targetDomain, setTargetDomain] = useState("");

  return (
    <div className="bg-[#1E1E1E] min-h-screen relative">
      {/* Kolom kiri */}
      <Sidebar data={leftSidebarData} targetDomain={targetDomain} position="left" />
      {/* Bagian tengah */}
      <CenterSection gridData={gridButtonData} targetDomain={targetDomain} setTargetDomain={setTargetDomain} />
      {/* Kolom kanan */}
      <Sidebar data={rightSidebarData} targetDomain={targetDomain} position="right" />
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ data, targetDomain, position }) => {
  const sidePosition = position === "left" ? "left-0" : "right-0";
  return (
    <div
      className={`absolute top-0 ${sidePosition} h-screen w-100 flex flex-col space-y-8 mt-[27px] px-4`}
    >
      {/* Membagi data menjadi 2 kolom */}
      <div className="grid grid-cols-2 gap-4 gap-y-8">
        {data.map((item, i) => (
          <DynamicButton key={i} {...item} targetDomain={targetDomain} />
        ))}
      </div>
    </div>
  );
};

// Center Section Component
const CenterSection = ({ gridData, targetDomain, setTargetDomain }) => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[37rem] h-screen flex flex-col items-center justify-center">
      <SearchBar targetDomain={targetDomain} setTargetDomain={setTargetDomain} />
      <div className="grid grid-cols-3 gap-6 gap-y-8 mt-42">
        {gridData.map((item, i) => (
          <DynamicButton key={i} {...item} targetDomain={targetDomain} />
        ))}
      </div>
    </div>
  );
};

// Dynamic Button Component (Reusable untuk Sidebar dan Grid)
const DynamicButton = ({ name, icon, query, urlTemplate, type, targetDomain }) => {
  const handleClick = () => {
    if (!targetDomain) {
      alert("Masukkan target domain terlebih dahulu!");
      return;
    }

    let url;
    if (type === "google") {
      url = `https://www.google.com/search?q=site:${encodeURIComponent(targetDomain)}+${encodeURIComponent(query)}`;
    }
    if (type === "custom" && urlTemplate) {
      url = urlTemplate.replace("{targetDomain}", encodeURIComponent(targetDomain));
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className="flex items-center px-4 py-3 bg-[#2D2D2D] text-white rounded-md shadow border border-gray-600 hover:bg-gray-700 transition-colors w-full"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <img src={icon} alt={name} className="w-6 h-6 mr-2" />
        <span className="truncate">{name}</span>
      </button>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2D2D2D] text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
        {name}
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ targetDomain, setTargetDomain }) => {
  return (
    <div className="absolute top-[191px]">
      <input
        type="text"
        placeholder="Enter Target Domain"
        value={targetDomain}
        onChange={(e) => setTargetDomain(e.target.value)}
        className="w-[588px] px-4 py-3 bg-[#2D2D2D] border border-[#404040] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010 17.5a7.5 7.5 0 006.65-3.85z"
        />
      </svg>
    </div>
  );
};

export default GoogleDorking;