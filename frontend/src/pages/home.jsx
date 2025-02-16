import React, { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";

const TerminalTab = ({
  active,
  commands,
  currentCommand,
  onCommandChange,
  onKeyDown,
}) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && active) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands, active]);

  if (!active) return null;

  return (
    <div
      ref={terminalRef}
      className="p-4 h-full overflow-y-auto text-gray-200 font-mono"
    >
      {/* Command History */}
      {commands.map((cmd, index) => (
        <div key={index} className="mb-2">
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center">
              <span className="text-green-400">┌──(</span>
              <span className="text-green-400">miquela@cyberf</span>
              <span className="text-gray-400">)-[</span>
              <span className="text-blue-400">~</span>
              <span className="text-gray-400">]</span>
            </div>

            {/* Footer (Prompt) */}
            <div className="flex items-center">
              <span className="text-green-400">└─$ </span>
              <span className="ml-2">{cmd.command}</span>
            </div>
          </div>
          <div className="text-gray-300 whitespace-pre-line">
            {cmd.output.startsWith("<img") ? (
              <div dangerouslySetInnerHTML={{ __html: cmd.output }} />
            ) : (
              cmd.output
            )}
          </div>
        </div>
      ))}
      
      {/* Current Command Input */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center">
          <span className="text-green-400">┌──(</span>
          <span className="text-green-400">miquela@cyberf</span>
          <span className="text-gray-400">)-[</span>
          <span className="text-blue-400">~</span>
          <span className="text-gray-400">]</span>
        </div>

        {/* Footer (Prompt with Input) */}
        <div className="flex items-center">
          <span className="text-green-400">└─$ </span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => onCommandChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 ml-2 bg-transparent outline-none border-none text-gray-200"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

const Terminal = () => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      commands: [
        {
          command: "welcome miquela",
          output: `<img src='/aset/test.png' class="w-[43rem] py-5" alt='banner'/>
          Type 'help' to see list available commands.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      currentCommand: "",
      history: [],
      historyIndex: -1,
    },
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const handleCommand = async (e) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const currentTab = tabs[tabIndex];
  
    // Handle Arrow Up for navigating history
    if (e.key === "ArrowUp") {
      e.preventDefault();
  
      if (currentTab.history.length > 0) {
        let updatedTabs = [...tabs];
  
        if (currentTab.historyIndex === -1) {
          // Save the current command before navigating history
          updatedTabs[tabIndex] = {
            ...currentTab,
            tempCommand: currentTab.currentCommand || "",
            historyIndex: 0,
          };
        }
  
        const newIndex = Math.min(currentTab.historyIndex + 1, currentTab.history.length - 1);
        updatedTabs[tabIndex] = {
          ...updatedTabs[tabIndex],
          historyIndex: newIndex,
          currentCommand: currentTab.history[currentTab.history.length - 1 - newIndex],
        };
  
        setTabs(updatedTabs);
      }
      return;
    }
  
    // Handle Arrow Down for navigating history
    if (e.key === "ArrowDown") {
      e.preventDefault();
  
      if (currentTab.historyIndex > 0) {
        const newIndex = currentTab.historyIndex - 1;
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex] = {
          ...currentTab,
          historyIndex: newIndex,
          currentCommand: currentTab.history[currentTab.history.length - 1 - newIndex],
        };
        setTabs(updatedTabs);
      } else if (currentTab.historyIndex === 0) {
        // Restore the saved command when reaching the bottom
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex] = {
          ...currentTab,
          historyIndex: -1,
          currentCommand: currentTab.tempCommand || "",
          tempCommand: undefined, // Clear the temporary command
        };
        setTabs(updatedTabs);
      }
      return;
    }
  
    // Handle Enter key for executing commands
    if (e.key === "Enter") {
      e.preventDefault();
  
      const commandText = currentTab.currentCommand.trim();
  
      // Save all commands to history (including duplicates and empty inputs)
      const updatedTabs = [...tabs];
      updatedTabs[tabIndex] = {
        ...currentTab,
        history: [...currentTab.history, commandText], // Save all commands
        historyIndex: -1,
        tempCommand: undefined,
      };
  
      // Reset input prompt
      updatedTabs[tabIndex].currentCommand = "";
      setTabs(updatedTabs);
  
      // Handle specific commands
      switch (commandText) {
        case "welcome":
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "welcome miquela",
              output: `\nType 'help' to see list available commands.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
  
        case "help":
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "help",
              output: `Available Commands:\n- help: Display this message\n- clear: Clean up the screen when it gets too messy.\n- whoami: Who are you in this vast digital universe? Find out here.\n- welcome: Feeling lost? Let us greet you back to reality.\n- tools: Check out some cool tools to help you out.\n- new-tab: Open a new tab if you're multitasking like a pro.\n- exit: Ghosting us? Use this to close the tab.\n- google-dorking: Find hidden stuff on the web like a ninja.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
  
        case "clear":
          updatedTabs[tabIndex].commands = [];
          break;
  
        case "whoami":
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "whoami",
              output: "You are miquela@cyberf. Welcome to the digital world!",
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
  
        case "tools":
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "tools",
              output: `Here are some cool tools you can use:\n- Network Scanner: Scan your network for devices.\n- Port Scanner: Check open ports on your system.\n- Password Generator: Create strong, secure passwords.\n- File Encryptor: Encrypt your files for extra security.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
  
        case "new-tab":
          const nextTerminalNumber = tabs.length + 1;
          const newTab = {
            id: `${nextTerminalNumber}`,
            name: `Terminal ${nextTerminalNumber}`,
            commands: [],
            currentCommand: "",
            history: [],
            historyIndex: -1,
          };
  
          updatedTabs.push(newTab);
          setActiveTab(`${nextTerminalNumber}`);
  
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "new-tab",
              output: `New tab created: ${newTab.name}. Stay here and keep working!`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
  
        case "exit":
          const remainingTabs = tabs.filter((tab) => tab.id !== activeTab);
  
          if (remainingTabs.length === 0) {
            const defaultTab = {
              id: "1",
              name: "Terminal 1",
              commands: [],
              currentCommand: "",
              history: [],
              historyIndex: -1,
            };
            setActiveTab("1");
            setTabs([defaultTab]);
            return;
          }
  
          setActiveTab(remainingTabs[0].id);
          setTabs(remainingTabs);
          return;
  
        case "google-dorking":
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: "google-dorking",
              output: "Redirecting to Google Dorking page...",
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
  
          setTimeout(() => {
            window.location.href = "/google-dorking";
          }, 500); // Delay for smooth UX
          break;
  
        default:
          updatedTabs[tabIndex].commands = [
            ...currentTab.commands,
            {
              command: commandText,
              output: `Command '${commandText}' is not available yet.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
          break;
      }
  
      setTabs(updatedTabs);
    }
  };

  const addNewTab = () => {
    const newId = Math.max(...tabs.map((tab) => tab.id)) + 1;

    // Initialize the new tab with the 'banner' command
    const newTab = {
      id: newId,
      commands: [
        {
          command: "welcome miquela",
          output: `<img src='/aset/test.png' class="w-[43rem] py-5" alt='banner'/>
          Type 'help' to see list available commands.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      currentCommand: "",
      history: [],
      historyIndex: -1,
    };

    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (tabId) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const updateCommand = (value) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex] = {
      ...updatedTabs[tabIndex],
      currentCommand: value,
    };
    setTabs(updatedTabs);
  };

  return (
    <div className="flex-1 bg-[#1e1e1e] text-gray-200 font-mono">
      <div className="h-full flex flex-col">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-gray-400 text-sm ml-2">
            Cyber Forge Terminal
          </span>
        </div>
        {/* Tabs Bar */}
        <div className="bg-[#2d2d2d] border-b border-gray-700 flex items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1e1e1e] text-gray-200"
                  : "text-gray-400 hover:bg-[#343434]"
              }`}
              title={`Switch to Terminal ${tab.id}`}
            >
              <span onClick={() => setActiveTab(tab.id)}>
                Terminal {tab.id}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={() => closeTab(tab.id)}
                  className="ml-2 hover:text-red-500"
                  title="Close Tab"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewTab}
            className="p-2 text-gray-400 hover:text-gray-200"
            title="Add New Tab"
          >
            <Plus size={20} />
          </button>
        </div>
        {/* Terminal Body */}
        <div className="flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <TerminalTab
              key={tab.id}
              active={activeTab === tab.id}
              commands={tab.commands}
              currentCommand={tab.currentCommand}
              onCommandChange={updateCommand}
              onKeyDown={handleCommand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
