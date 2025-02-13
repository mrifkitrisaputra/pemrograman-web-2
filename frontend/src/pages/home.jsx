import React, { useState, useRef } from "react";

function Homepage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-green-500 font-mono p-4">
      <Terminal />
    </div>
  );
}

function Terminal() {
  const [command, setCommand] = useState(""); // State untuk input command
  const [output, setOutput] = useState([]); // State untuk menyimpan output terminal
  const [error, setError] = useState(""); // State untuk menampilkan error
  const terminalRef = useRef(null); // Ref untuk scroll ke bawah saat ada output baru

  // Dummy commands untuk simulasi (bisa diganti dengan API calls nanti)
  const dummyCommands = {
    help: `
Available Commands:
- tools       : List all available tools.
- dork        : Run Google Dorking.
- clear       : Clear the terminal.
- exit        : Logout from the system.
    `,
    tools: `
Available Tools:
1. Nmap       - Network scanning tool
2. Metasploit - Penetration testing framework
3. Wireshark  - Packet analyzer
4. John       - Password cracking tool
    `,
    dork: `
Running Google Dorking...
Results:
1. https://example.com/secret-file.pdf
2. https://example.com/admin-login
    `,
    clear: "",
    exit: "Logging out...",
  };

  // Fungsi untuk mengeksekusi command
  const handleExecuteCommand = () => {
    if (!command.trim()) {
      setError("Please enter a valid command.");
      return;
    }

    setError(""); // Reset error
    const cmd = command.trim().toLowerCase();

    if (cmd === "exit") {
      alert("Logout clicked");
      return;
    }

    if (dummyCommands[cmd]) {
      setOutput((prevOutput) => [
        ...prevOutput,
        `$ ${command}`,
        dummyCommands[cmd],
      ]);
    } else {
      setOutput((prevOutput) => [
        ...prevOutput,
        `$ ${command}`,
        "Command not found. Type 'help' for available commands.",
      ]);
    }

    setCommand(""); // Reset input field
  };

  // Scroll ke bawah saat ada output baru
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Fungsi untuk menangani klik pada navbar
  const handleNavbarClick = (action) => {
    switch (action) {
      case "home":
        setOutput((prevOutput) => [
          ...prevOutput,
          "Navigating to Home...",
        ]);
        break;
      case "tools":
        setOutput((prevOutput) => [
          ...prevOutput,
          "Listing available tools...",
          dummyCommands.tools,
        ]);
        break;
      case "dork":
        setOutput((prevOutput) => [
          ...prevOutput,
          "Running Google Dorking...",
          dummyCommands.dork,
        ]);
        break;
      case "profile":
        setOutput((prevOutput) => [
          ...prevOutput,
          "Opening profile settings...",
        ]);
        break;
      default:
        setOutput((prevOutput) => [
          ...prevOutput,
          "Action not recognized.",
        ]);
    }
  };

  return (
    <div className="max-w-full">
      {/* Header atau pesan selamat datang */}
      <p>Welcome to the Linux Terminal Simulation!</p>

      {/* Container untuk output dan input */}
      <div
        ref={terminalRef}
        className="mt-4 overflow-y-auto h-[calc(100vh-150px)]"
      >
        {/* Navbar sebagai bagian dari terminal */}
        <div className="text-gray-400 flex space-x-2">
          <span>[</span>
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => handleNavbarClick("home")}
          >
            🛡️ Cyber Forge
          </span>
          <span>|</span>
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => handleNavbarClick("home")}
          >
            Home
          </span>
          <span>|</span>
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => handleNavbarClick("tools")}
          >
            Tools
          </span>
          <span>|</span>
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => handleNavbarClick("dork")}
          >
            Google Dorking
          </span>
          <span>|</span>
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => handleNavbarClick("profile")}
          >
            👤 Profile
          </span>
          <span>]</span>
        </div>

        {/* Output Terminal */}
        <div>
          {output.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* Baris Prompt dengan Input Command */}
      <div className="flex items-center mt-2">
        <span className="text-blue-400">user@linux</span>
        :<span className="text-yellow-400">~</span>$
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleExecuteCommand();
          }}
          placeholder=""
          autoFocus
          className="bg-transparent outline-none text-white flex-grow ml-1"
        />
        <span className="blink">_</span>
      </div>
    </div>
  );
}

export default Homepage;