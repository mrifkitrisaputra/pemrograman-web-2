import React from "react";

// Data untuk sidebar dan grid buttons (7 duplikat)
const buttonData = Array(7).fill({ name: "Directory Listing", icon: "aset/logo.png" });
const gridData = Array(12).fill({ name: "Directory Listing", icon: "aset/logo.png" });

const GoogleDorking = () => {
  return (
    <div className="bg-[#1E1E1E] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-row justify-between">
        <Sidebar data={buttonData} />
        <CenterSection gridData={gridData} />
        <Sidebar data={buttonData} />
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ data }) => {
  return (
    <div className="flex flex-col space-y-8 mt-[27px]">
      {data.map((item, i) => (
        <SidebarButton key={i} name={item.name} icon={item.icon} />
      ))}
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ name, icon }) => {
  return (
    <button className="flex items-center px-4 py-3 bg-[#2D2D2D] text-white rounded-md shadow border border-gray-600 hover:bg-gray-700 transition-colors">
      <img src={icon} alt={name} className="w-6 h-6 mr-2" />
      {name}
    </button>
  );
};

// Center Section Component
const CenterSection = ({ gridData }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-[37rem]">
      <SearchBar />
      <div className="grid grid-cols-3 gap-6 gap-y-8 mt-42">
        {gridData.map((item, i) => (
          <GridButton key={i} name={item.name} icon={item.icon} />
        ))}
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = () => {
  return (
    <div className="absolute top-[191px]">
      <input
        type="text"
        placeholder="Enter Target Domain"
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

// Grid Button Component
const GridButton = ({ name, icon }) => {
  return (
    <button className="flex items-center px-4 py-3 bg-[#2D2D2D] text-white rounded-md shadow border border-gray-600 hover:bg-gray-700 transition-colors">
      <img src={icon} alt={name} className="w-6 h-6 mr-2" />
      {name}
    </button>
  );
};

export default GoogleDorking;
