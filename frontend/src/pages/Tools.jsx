import React, { useState } from "react";

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
  
    // Fungsi untuk menambahkan tool baru
    const handleAddTool = () => {
      if (!toolToAdd.name || !toolToAdd.category || !toolToAdd.description || !toolToAdd.install_command) {
        alert("Please fill in all fields.");
        return;
      }
  
      const newTool = {
        id: tools.length + 1,
        ...toolToAdd,
      };
  
      setTools([...tools, newTool]);
      setToolToAdd({ id: null, name: "", category: "", description: "", install_command: "" });
      setModalOpen(false);
      alert("Tool added successfully.");
    };
  
    // Fungsi untuk mengedit tool yang dipilih
    const handleEditTool = () => {
      const updatedTools = tools.map((tool) =>
        tool.id === toolToAdd.id ? { ...tool, ...toolToAdd } : tool
      );
  
      setTools(updatedTools);
      setToolToAdd({ id: null, name: "", category: "", description: "", install_command: "" });
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
          <p className="text-lg text-gray-400">Manage your cybersecurity tools collection</p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#2D2D2D] rounded-lg border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-[#2D2D2D] rounded-lg border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="md:w-48 px-6 py-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg font-semibold text-black hover:opacity-90 transition-opacity"
          >
            + Add Tool
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
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="p-2 hover:bg-[#404040] rounded-lg text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{tool.description}</p>
              <div className="bg-[#1E1E1E] p-3 rounded-lg">
                <code className="text-sm break-words">{tool.install_command}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <div className={`fixed inset-0 bg-black/70 flex items-center justify-center p-4 ${modalOpen ? "flex" : "hidden"}`}>
        <div className="bg-[#2D2D2D] rounded-xl p-6 w-full max-w-lg relative border border-[#404040]">
          <button
            onClick={() => {
              setModalOpen(false);
              setToolToAdd({ id: null, name: "", category: "", description: "", install_command: "" });
            }}
            className="absolute top-4 right-4 p-2 hover:bg-[#404040] rounded-lg"
          >
            ✕
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">
            {toolToAdd.id ? "Edit Tool" : "New Tool"}
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Tool Name</label>
              <input
                type="text"
                value={toolToAdd.name}
                onChange={(e) => setToolToAdd({ ...toolToAdd, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={toolToAdd.category}
                onChange={(e) => setToolToAdd({ ...toolToAdd, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={toolToAdd.description}
                onChange={(e) => setToolToAdd({ ...toolToAdd, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Install Command</label>
              <input
                type="text"
                value={toolToAdd.install_command}
                onChange={(e) => setToolToAdd({ ...toolToAdd, install_command: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-lg hover:bg-[#404040] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={toolToAdd.id ? handleEditTool : handleAddTool}
                className="px-6 py-2 bg-blue-400 text-black rounded-lg font-semibold hover:bg-blue-300 transition-colors"
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