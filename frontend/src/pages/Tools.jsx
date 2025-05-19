import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api";
import {
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaTimes,
  FaPlus,
  FaFilter,
} from "react-icons/fa";

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toolToAdd, setToolToAdd] = useState({
    id: null,
    name: "",
    category: "",
    description: "",
    installation_command: "",
  });
  const [loading, setLoading] = useState(false); // Untuk loading
  const [message, setMessage] = useState({ type: "", text: "" }); // Untuk notifikasi

  // Fetch tools dari API saat komponen mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axiosInstance.get("/tools");
        setTools(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
        alert("Failed to load tools.");
      }
    };
    fetchTools();
  }, []);

  // Fungsi untuk menambahkan tool baru ke database + cek & install via WSL
  const handleAddTool = async () => {
    const { name, category, description, installation_command } = toolToAdd;

    if (!name || !category || !description || !installation_command) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (!toolToAdd.installation_command.includes("sudo apt install")) {
      alert("Command harus dimulai dengan 'sudo apt install'");
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Cek apakah tool sudah ada di sistem
      setMessage({ type: "info", text: `Checking if ${name} is installed...` });
      const checkResponse = await axiosInstance.post("/tool/check-install", {
        tool: name,
      });

      const isInstalled = checkResponse.data.installed;

      if (!isInstalled) {
        // 2. Jika belum, jalankan instalasi
        setMessage({ type: "info", text: `Installing ${name} via WSL...` });

        const execResponse = await axiosInstance.post("/execute-wsl", {
          command: "sudo apt update && " + installation_command + " -y",
        });

        if (!execResponse.data.success) {
          throw new Error(execResponse.data.error || "Installation failed.");
        }
      }

      // 3. Simpan tool ke database Laravel
      setMessage({ type: "info", text: "Saving to database..." });

      const toolResponse = await axiosInstance.post("/tools", {
        name,
        category,
        description,
        installation_command,
      });

      setTools([...tools, toolResponse.data.data]);
      setToolToAdd({
        id: null,
        name: "",
        category: "",
        description: "",
        installation_command: "",
      });
      setMessage({
        type: "success",
        text: `Tool "${name}" added successfully.`,
      });
    } catch (error) {
      console.error("Error adding/installing tool:", error);
      setMessage({
        type: "error",
        text: `Failed to add/install tool: ${error.message || "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit tool yang dipilih
  const handleEditTool = async () => {
    const { id, name, category, description, installation_command } = toolToAdd;
    try {
      const response = await axiosInstance.put(`/tools/${id}`, {
        name,
        category,
        description,
        installation_command,
      });
      const updatedTools = tools.map((tool) =>
        tool.id === id ? response.data.data : tool
      );
      setTools(updatedTools);
      setToolToAdd({
        id: null,
        name: "",
        category: "",
        description: "",
        installation_command: "",
      });
      setModalOpen(false);
      alert("Tool updated successfully.");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        alert("Validation Errors:\n" + errors);
      } else {
        alert("Failed to update tool.");
      }
    }
  };

  // Fungsi untuk menghapus tool
  const handleDeleteTool = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    try {
      await axiosInstance.delete(`/tools/${id}`);
      const updatedTools = tools.filter((tool) => tool.id !== id);
      setTools(updatedTools);
      alert("Tool deleted successfully.");
    } catch (error) {
      alert("Failed to delete tool.");
    }
  };

  // Filter tools berdasarkan search & kategori
  const filteredTools = tools
    .filter((tool) => tool.is_installed)
    .filter(
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
                  {tool.installation_command}
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
                installation_command: "",
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
                value={toolToAdd.installation_command}
                onChange={(e) =>
                  setToolToAdd({
                    ...toolToAdd,
                    installation_command: e.target.value,
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

      {/* Notification */}
      {message.text && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-md text-sm shadow-lg z-50 animate-fade-in ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : message.type === "error"
              ? "bg-red-100 text-red-800"
              : message.type === "info"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Tools;
