import { useEffect } from "react";
import { CommandId, CommandPayload } from "../state/commandStore";

type UseShortcutsParams = {
  isConsoleOpen: boolean;
  executeCommand: (id: CommandId, payload?: CommandPayload) => void;
};

type Shortcut = {
  keys: string[];
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  action: () => void;
};

export function useShortcuts({
  isConsoleOpen,
  executeCommand,
}: UseShortcutsParams) {
  useEffect(() => {
    const pressed = new Set<string>();

    const shortcuts: Shortcut[] = [
      { keys: ["c"], alt: true, action: () => executeCommand("openConsole") },
      { keys: ["b"], alt: true, action: () => executeCommand("toggleSidebar") },
      { keys: ["n"], alt: true, action: () => executeCommand("newProject") },
      { keys: ["o"], alt: true, action: () => executeCommand("openProject") },
      { keys: ["e"], alt: true, action: () => executeCommand("exportProject") },
      { keys: ["+"], alt: true, action: () => executeCommand("zoomIn") },
      { keys: ["-"], alt: true, action: () => executeCommand("zoomOut") },
      { keys: [","], alt: true, action: () => executeCommand("openModal", { modal: "settings" }) },
    ];

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      pressed.add(key);

      for (const sc of shortcuts) {
        const matches =
          (!sc.alt || e.altKey) &&
          (!sc.ctrl || e.ctrlKey) &&
          (!sc.meta || e.metaKey) &&
          sc.keys.includes(key);
        if (matches) {
          e.preventDefault();
          sc.action();
        }
      }

      if (isConsoleOpen && pressed.has("c") && e.altKey) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          executeCommand(
            e.key === "ArrowUp" ? "maximizeConsole" : "minimizeConsole"
          );
        } else if (e.key.toLowerCase() === "q") {
          e.preventDefault();
          executeCommand("closeConsole");
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressed.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isConsoleOpen, executeCommand]);
}
