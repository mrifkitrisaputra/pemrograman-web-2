import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrashAlt, FaTimes, FaPlus, FaFilter } from "react-icons/fa";

const Tools = () => {
  // Dummy data untuk tools
  const initialTools = [
    {
      id: 1,
      name: "Nmap",
      category: "Pentesting",
      description: "Network scanning tool",
      install_command: "sudo apt install nmap",
    },
    {
      id: 2,
      name: "Metasploit",
      category: "Exploitation",
      description: "Penetration testing framework",
      install_command: "sudo apt install metasploit-framework",
    },
    {
      id: 3,
      name: "Wireshark",
      category: "Forensic",
      description: "Packet analyzer",
      install_command: "sudo apt install wireshark",
    },
    {
      id: 4,
      name: "John the Ripper",
      category: "Cracking",
      description: "Password cracking tool",
      install_command: "sudo apt install john",
    },
  ];

  const [tools, setTools] = useState(initialTools); // State untuk menyimpan daftar tools
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [selectedCategory, setSelectedCategory] = useState(""); // State untuk filter kategori
  const [modalOpen, setModalOpen] = useState(false); // State untuk modal add/edit tool
  const [toolToAdd, setToolToAdd] = useState({
    id: null,
    name: "",
    category: "",
    description: "",
    install_command: "",
  }); // State untuk tool yang akan ditambahkan

  // Fungsi untuk menambahkan tool baru dengan validasi
  const handleAddTool = () => {
    const { name, category, description, install_command } = toolToAdd;

    // Validasi: Pastikan semua field terisi
    if (!name || !category || !description || !install_command) {
      alert("Please fill in all fields.");
      return;
    }

    // Validasi: Pastikan nama tool unik
    const isNameUnique = !tools.some(
      (tool) => tool.name.toLowerCase() === name.toLowerCase()
    );
    if (!isNameUnique) {
      alert("Tool name must be unique.");
      return;
    }

    // Jika validasi berhasil, tambahkan tool baru
    const newTool = {
      id: tools.length + 1,
      name,
      category,
      description,
      install_command,
    };

    setTools([...tools, newTool]);
    setToolToAdd({
      id: null,
      name: "",
      category: "",
      description: "",
      install_command: "",
    });
    setModalOpen(false);
    alert("Tool added successfully.");
  };

  // Fungsi untuk mengedit tool yang dipilih
  const handleEditTool = () => {
    const updatedTools = tools.map((tool) =>
      tool.id === toolToAdd.id ? { ...tool, ...toolToAdd } : tool
    );

    setTools(updatedTools);
    setToolToAdd({
      id: null,
      name: "",
      category: "",
      description: "",
      install_command: "",
    });
    setModalOpen(false);
    alert("Tool updated successfully.");
  };

  // Fungsi untuk menghapus tool yang dipilih
  const handleDeleteTool = (id) => {
    const updatedTools = tools.filter((tool) => tool.id !== id);
    setTools(updatedTools);
    alert("Tool deleted successfully.");
  };

  // Fungsi untuk memfilter tools berdasarkan pencarian dan kategori
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || tool.category === selectedCategory)
  );

  // Mendapatkan daftar kategori unik
  const categories = [...new Set(tools.map((tool) => tool.category))];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-gray-300 font-sans flex flex-col items-center justify-start">
      {/* Main Content */}
      <div className="w-full max-w-7xl px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Tools Management</h1>
          <p className="text-lg text-gray-400">
            Manage your cybersecurity tools collection
          </p>
        </div>
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full flex-1 pl-11 pr-4 py-3 bg-[#2D2D2D] rounded-lg border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <FaFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-3 bg-[#2D2D2D] rounded-lg border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="md:w-48 px-6 py-3 bg-green-500 rounded-lg font-semibold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <FaPlus size={16} />
            Add Tool
          </button>
        </div>
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-[#2D2D2D] rounded-xl p-5 border border-[#404040] hover:border-blue-400 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                  <span className="text-sm px-3 py-1 bg-[#404040] rounded-full mt-2 inline-block">
                    {tool.category}
                  </span>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setToolToAdd(tool);
                      setModalOpen(true);
                    }}
                    className="p-2 hover:bg-[#404040] rounded-lg"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="p-2 hover:bg-[#404040] rounded-lg text-red-400"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{tool.description}</p>
              <div className="bg-[#1E1E1E] p-3 rounded-lg">
                <code className="text-sm break-words">
                  {tool.install_command}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black/70 flex items-center justify-center p-4 ${
          modalOpen ? "flex" : "hidden"
        }`}
      >
        <div className="bg-[#1E1E1E] rounded-2xl p-8 w-full max-w-lg shadow-lg border border-[#333] relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setModalOpen(false);
              setToolToAdd({
                id: null,
                name: "",
                category: "",
                description: "",
                install_command: "",
              });
            }}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes size={20} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {toolToAdd.id ? "Edit Tool" : "Add New Tool"}
          </h2>

          {/* Form */}
          <div className="space-y-4">
            {/* Tool Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tool Name
              </label>
              <input
                type="text"
                value={toolToAdd.name}
                onChange={(e) =>
                  setToolToAdd({ ...toolToAdd, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tool name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <input
                type="text"
                value={toolToAdd.category}
                onChange={(e) =>
                  setToolToAdd({ ...toolToAdd, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                value={toolToAdd.description}
                onChange={(e) =>
                  setToolToAdd({ ...toolToAdd, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="Enter description"
              />
            </div>

            {/* Install Command */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Install Command
              </label>
              <input
                type="text"
                value={toolToAdd.install_command}
                onChange={(e) =>
                  setToolToAdd({
                    ...toolToAdd,
                    install_command: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#2D2D2D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter install command"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={toolToAdd.id ? handleEditTool : handleAddTool}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                {toolToAdd.id ? "Save Changes" : "Create Tool"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
