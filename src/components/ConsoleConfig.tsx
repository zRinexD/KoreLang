import { Info, Zap } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { LogEntry } from "../types";
import { useTranslation } from "../i18n";
import { useCommandExecutor, resolveModal } from "../state/commandStore";

const TERMINAL_HEADER = `
██╗  ██╗ ██████╗ ██████╗ ███████╗██╗      █████╗ ███╗   ██╗ ██████╗ 
██║ ██╔╝██╔═══██╗██╔══██╗██╔════╝██║     ██╔══██╗████╗  ██║██╔════╝ 
█████╔╝ ██║   ██║██████╔╝█████╗  ██║     ███████║██╔██╗ ██║██║  ███╗
██╔═██╗ ██║   ██║██╔══██╗██╔══╝  ██║     ██╔══██║██║╚██╗██║██║   ██║
██║  ██╗╚██████╔╝██║  ██║███████╗███████╗██║  ██║██║ ╚████║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
`;

interface ConsoleConfigProps {
  history: LogEntry[];
  setHistory: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  loadingAI: boolean;
  author?: string;
}

const ConsoleConfig: React.FC<ConsoleConfigProps> = ({ history, setHistory, loadingAI, author = "user" }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const executeCommand = useCommandExecutor();

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [history]);

  const addLog = (type: LogEntry["type"], content: string, component?: React.ReactNode) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev, { type, content, timestamp, component }]);
  };

  const clearTerminal = () => {
    setHistory([{ type: "info", content: TERMINAL_HEADER, timestamp: "" }]);
  };

  useEffect(() => {
    if (history.length === 0) {
      clearTerminal();
      handleCommand("HELP");
    }
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    if (!cmdStr.trim()) return;
    addLog("command", cmdStr);

    const [rawCommand, ...args] = cmdStr.trim().split(/\s+/);
    const cmd = rawCommand.toUpperCase();

    switch (cmd) {
      case "CLEAR":
      case "CLS":
        clearTerminal();
        break;
      case "HELP":
        addLog("output", "AVAILABLE COMMANDS:");
        addLog("output", "CLEAR - Clears the terminal.");
        addLog("output", "HELP - Shows this help message.");
        addLog("output", "ABOUT - Shows info about this console.");
        addLog("output", "SIDEBAR - Toggle the sidebar.");
        addLog("output", "CONSOLE OPEN|CLOSE|MAX|MIN - Control console pane.");
        addLog("output", "NEW - Start a new project.");
        addLog("output", "OPEN - Open an existing project.");
        addLog("output", "MODAL <name> - Open a modal (about, settings, constraints, wizard, whatsnew).");
        break;
      case "ABOUT":
        addLog("output", "KoreLang Console v1.1 - command-aware shell.");
        break;
      case "SIDEBAR":
        executeCommand("toggleSidebar");
        addLog("success", "Sidebar toggled.");
        break;
      case "CONSOLE": {
        const action = args[0]?.toUpperCase();
        if (!action) {
          addLog("error", "Specify OPEN, CLOSE, MAX, or MIN.");
          break;
        }
        if (action === "OPEN") executeCommand("openConsole");
        else if (action === "CLOSE") executeCommand("closeConsole");
        else if (action === "MAX") executeCommand("maximizeConsole");
        else if (action === "MIN") executeCommand("minimizeConsole");
        else {
          addLog("error", `Unknown console action: ${action}`);
          break;
        }
        addLog("success", `Console ${action.toLowerCase()} command executed.`);
        break;
      }
      case "NEW":
        executeCommand("newProject");
        addLog("success", "Launching new project wizard.");
        break;
      case "OPEN":
        executeCommand("openProject");
        addLog("success", "Open project triggered.");
        break;
      case "EXPORT":
        executeCommand("exportProject");
        addLog("success", "Export command dispatched.");
        break;
      case "MODAL": {
        const modalName = args[0];
        const modal = resolveModal(modalName);
        if (!modal) {
          addLog("error", `Unknown modal: ${modalName || "<missing>"}`);
          break;
        }
        executeCommand("openModal", { modal });
        addLog("success", `Opened modal: ${modal}.`);
        break;
      }
      default:
        addLog("error", `Command not recognized: ${cmdStr}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-main)] font-mono text-sm relative">
      {/* Header */}
      <div className="p-2 border-b border-white/5 flex justify-between items-center text-xs text-[var(--text-2)]">
        <span className="flex items-center gap-2">
          <Info size={10} /> KoreLang kernel_v1.1
        </span>
        <span className="flex items-center gap-2 text-emerald-500">
          {loadingAI && <Zap size={12} style={{ color: 'var(--accent)' }} className="animate-pulse" />}
          SYSTEM_READY
        </span>
      </div>

      {/* Terminal history */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar" onClick={() => inputRef.current?.focus()}>
        {history.map((log, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              log.type === "error"
                ? "text-red-500"
                : log.type === "success"
                ? "text-emerald-400"
                : log.type === "command"
                ? "text-[var(--text-1)] font-bold"
                : "text-[var(--text-2)]"
            }`}
          >
            <div className="flex gap-3 leading-relaxed">
              {log.type === "command" && <span className="text-emerald-500">KoreLang-@{author}:~$</span>}
              <span className={log.content === TERMINAL_HEADER ? "whitespace-pre text-blue-400 font-bold leading-none" : ""}>{log.content}</span>
            </div>
            {log.component && <div className="mt-2 mb-4">{log.component}</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 bg-[var(--bg-main)] border-t border-white/5 flex items-center">
        <span className="font-bold text-emerald-500">KoreLang-@{author}:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(input);
              setInput("");
            }
          }}
          className="bg-transparent border-none outline-none text-[var(--text-1)] w-full"
          placeholder={t("console.placeholder") || "Enter command..."}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default ConsoleConfig;
