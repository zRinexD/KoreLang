import { useEffect } from "react";

type UseShortcutsParams = {
  isConsoleOpen: boolean;
  setIsConsoleOpen: (v: boolean | ((v: boolean) => boolean)) => void;
  setIsSidebarOpen: (v: boolean | ((v: boolean) => boolean)) => void;

  onNewProject: () => void;
  onOpenProject: () => void;
  onExportProject: () => void;

  onZoomIn: () => void;
  onZoomOut: () => void;
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
  setIsConsoleOpen,
  setIsSidebarOpen,
  onNewProject,
  onOpenProject,
  onExportProject,
  onZoomIn,
  onZoomOut,
}: UseShortcutsParams) {
  useEffect(() => {
    const pressed = new Set<string>();

    const shortcuts: Shortcut[] = [
      { keys: ["c"], alt: true, action: () => setIsConsoleOpen(true) },
      { keys: ["b"], alt: true, action: () => setIsSidebarOpen((v) => !v) },
      { keys: ["n"], alt: true, action: onNewProject },
      { keys: ["o"], alt: true, action: onOpenProject },
      { keys: ["e"], alt: true, action: onExportProject },
      { keys: ["+"], alt: true, action: onZoomIn },
      { keys: ["-"], alt: true, action: onZoomOut },
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
          window.dispatchEvent(
            new CustomEvent("console-shortcut", {
              detail: { action: e.key === "ArrowUp" ? "maximize" : "minimize" },
            })
          );
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
  }, [
    isConsoleOpen,
    setIsConsoleOpen,
    setIsSidebarOpen,
    onNewProject,
    onOpenProject,
    onExportProject,
    onZoomIn,
    onZoomOut,
  ]);
}
