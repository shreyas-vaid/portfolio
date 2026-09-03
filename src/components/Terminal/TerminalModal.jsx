import { useState, useRef, useEffect } from "react";
import { gameState } from "../../utils/gameState";
import { profileData } from "../../data/profile";
import { missionHistory } from "../../data/experience";
import { questProjects } from "../../data/projects";
import { abilityCategories } from "../../data/skills";
import "./terminal.css";

const COMMANDS_HELP = [
  { cmd: "help", desc: "List all terminal commands" },
  { cmd: "whoami", desc: "Display current user and developer identity" },
  { cmd: "about", desc: "Print classified biographical overview" },
  { cmd: "skills", desc: "Display technical ability matrix" },
  { cmd: "projects", desc: "Query active quest and projects database" },
  { cmd: "experience", desc: "Print operational mission logs & internships" },
  { cmd: "education", desc: "Display academic systems credentials" },
  { cmd: "inventory", desc: "Inspect collected inventory items" },
  { cmd: "achievements", desc: "List verified & exploration achievements" },
  { cmd: "status", desc: "Check system diagnostics, XP, and rank" },
  { cmd: "theme [red|violet]", desc: "Switch system visual protocol" },
  { cmd: "clear", desc: "Clear terminal buffer" },
  { cmd: "sudo coffee", desc: "Request administrator caffeine rations" }
];

export default function TerminalModal({ isOpen, onClose, onTriggerThemeUnlock }) {
  const [history, setHistory] = useState([
    {
      type: "system",
      text: "SV-OS TERMINAL // KERNEL v2.4.0\nType 'help' to list available system commands."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gameState.awardXP("open_terminal_modal", 20, "TERMINAL ACCESSED");
      gameState.unlockAchievement("ach-exp-terminal", "TERMINAL OPERATOR");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    const outputRows = [];
    outputRows.push({ type: "user", text: `> ${trimmed}` });

    switch (cmd) {
      case "help":
        outputRows.push({
          type: "system",
          text: COMMANDS_HELP.map((c) => `  ${c.cmd.padEnd(22)} - ${c.desc}`).join("\n")
        });
        break;

      case "whoami":
        outputRows.push({
          type: "system",
          text: `NAME: ${profileData.name}\nROLE: ${profileData.title}\nCLASS: ${profileData.classType}\nSTATUS: ${profileData.status}\nSECURITY CLEARANCE: TIER-1 ARCHITECT`
        });
        break;

      case "about":
        outputRows.push({
          type: "system",
          text: `BIOGRAPHICAL DOSSIER:\nShreyas Vaid operates at the intersection of data analytics, web engineering, and creative UI architecture. Blends rigorous data pipelines with high-performance reactive applications.`
        });
        break;

      case "skills":
        outputRows.push({
          type: "system",
          text: abilityCategories
            .map((c) => `[${c.title}]\n  ${c.skills.map((s) => s.name).join(", ")}`)
            .join("\n\n")
        });
        break;

      case "projects":
      case "quests":
        outputRows.push({
          type: "system",
          text: questProjects
            .map((p) => `• [${p.questCode}] ${p.title} (${p.type})\n  ${p.description || p.subtitle}`)
            .join("\n\n")
        });
        break;

      case "experience":
      case "internship":
      case "missions":
        outputRows.push({
          type: "system",
          text: missionHistory
            .map((m) => `• [${m.missionCode}] ${m.role} - ${m.organization} (${m.period})\n  ${m.description}`)
            .join("\n\n")
        });
        break;

      case "education":
        outputRows.push({
          type: "system",
          text: `ACADEMIC DOSSIER:\n• DEGREE: Bachelor of Engineering (B.E.) in Computer Science Engineering\n• INSTITUTION: Chandigarh University, Mohali\n• GRADUATION: Expected May 2028\n• CURRENT CGPA: 7.02\n• CORE CURRICULUM: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks`
        });
        break;

      case "inventory":
        outputRows.push({
          type: "system",
          text: `INVENTORY MODULES:\n${gameState.state.unlockedItems.join(", ")}\n\nUse the HUD [🎒 INVENTORY] button for the visual equipment interface.`
        });
        break;

      case "achievements":
        outputRows.push({
          type: "system",
          text: `UNLOCKED ACHIEVEMENTS: ${gameState.state.unlockedAchievements.length} Cleared.\nUse the HUD [🏆 ACHIEVEMENTS] button for full details.`
        });
        break;

      case "status": {
        const lvl = gameState.getCurrentLevel();
        outputRows.push({
          type: "system",
          text: `SYSTEM DIAGNOSTICS:\n• RANK: LVL 0${lvl.level} // ${lvl.title}\n• EXPLORATION XP: ${gameState.state.xp} / ${lvl.maxXP}\n• ACTIVE PROTOCOL: SYSTEM // ${gameState.state.activeTheme.toUpperCase()}\n• COMPLETED ACTIONS: ${Object.keys(gameState.state.completedActions).length}\n• RETURN VISITS: ${gameState.state.visitCount}`
        });
        break;
      }

      case "sudo":
        if (arg === "coffee") {
          gameState.awardXP("sudo_coffee_easter_egg", 35, "COFFEE RATIONS ATTEMPTED");
          gameState.unlockItem("item-coffee-thermos", "SUDO COFFEE THERMOS");
          gameState.unlockAchievement("ach-exp-coffee", "CAFFEINE REQUISITION");
          outputRows.push({
            type: "error",
            text: `ACCESS DENIED.\n\nREASON:\nCoffee privileges require root administrator authorization.\n(Hint: SUDO COFFEE THERMOS has been added to your inventory!)`
          });
        } else {
          outputRows.push({
            type: "error",
            text: `sudo: ${arg}: command not recognized in unprivileged shell.`
          });
        }
        break;

      case "theme":
      case "protocol":
        if (arg === "violet" || arg === "night violet") {
          gameState.unlockVioletTheme();
          if (onTriggerThemeUnlock) onTriggerThemeUnlock();
          outputRows.push({
            type: "success",
            text: `SYSTEM OVERRIDE DETECTED...\nPROTOCOL SHIFT: NIGHT // VIOLET ACTIVATED.`
          });
        } else if (arg === "red") {
          gameState.setTheme("red");
          outputRows.push({
            type: "system",
            text: `PROTOCOL RESTORED: SYSTEM // RED.`
          });
        } else {
          outputRows.push({
            type: "system",
            text: `Usage: theme [red | violet]\nCurrent Theme: SYSTEM // ${gameState.state.activeTheme.toUpperCase()}`
          });
        }
        break;

      case "violet":
      case "night violet":
        gameState.unlockVioletTheme();
        if (onTriggerThemeUnlock) onTriggerThemeUnlock();
        outputRows.push({
          type: "success",
          text: `SYSTEM OVERRIDE INITIATED...\nNIGHT // VIOLET THEME UNLOCKED!`
        });
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      default:
        outputRows.push({
          type: "error",
          text: `command not found: '${trimmed}'. Type 'help' for available commands.`
        });
        break;
    }

    setHistory((prev) => [...prev, ...outputRows]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className="terminal-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="terminal-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-header-title">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title-text">SV-OS TERMINAL // ROOT CONSOLE</span>
          </div>
          <button type="button" className="terminal-close-btn" onClick={onClose}>
            ✕ CLOSE
          </button>
        </div>

        {/* Scanlines Effect Overlay */}
        <div className="terminal-scanlines" />

        {/* Buffer Area */}
        <div className="terminal-body">
          {history.map((item, idx) => (
            <div key={idx} className={`terminal-line line-${item.type}`}>
              <pre>{item.text}</pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Line */}
        <div className="terminal-input-row">
          <span className="terminal-prompt">shreyas@sv-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input-field"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' or command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
