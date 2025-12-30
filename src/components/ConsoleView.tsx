import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "../i18n";
import { X, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { ViewState } from "../types";
import ConsoleConfig from "./ConsoleConfig";

interface ConsoleViewProps {
  isOpen: boolean;
  loadingAI: boolean;
  onClose: () => void;
  author?: string;
  currentView?: ViewState;
}

const ConsoleView: React.FC<ConsoleViewProps> = ({
  isOpen,
  loadingAI,
  onClose,
  author,
  currentView,
}) => {
  const { t } = useTranslation();

  const [height, setHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("console_panel_height");
      if (saved)
        return Math.max(
          120,
          Math.min(window.innerHeight - 100, parseInt(saved, 10))
        );
    } catch (e) {}
    return 320;
  });

  const resizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(height);

  const prevHeightRef = useRef(height);
  const lastMaximizeAtRef = useRef<number>(0);
  const maximizeCountRef = useRef<number>(0);

  // match the app footer bar height (Tailwind h-6 = 1.5rem = 24px)
  const MINIMIZED_HEIGHT = 24;
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem("console_panel_minimized") === "1";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (!isMinimized) {
        localStorage.setItem("console_panel_height", String(height));
      }
    } catch (e) {}
  }, [height, isMinimized]);

  useEffect(() => {
    try {
      localStorage.setItem("console_panel_minimized", isMinimized ? "1" : "0");
    } catch (e) {}
  }, [isMinimized]);

  useEffect(() => {
    if (isMinimized) {
      try {
        prevHeightRef.current = height;
        setHeight(MINIMIZED_HEIGHT);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("console_panel_height");
        const parsed = saved
          ? parseInt(saved, 10)
          : prevHeightRef.current || 320;
        const restore = Math.max(
          120,
          Math.min(window.innerHeight - 100, parsed)
        );
        setHeight(restore);
      } catch (e) {}
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Listen for programmatic shortcuts (dispatched from App) to maximize/minimize
  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        if (!isOpen) return; // only act when console is open
        const detail = (ev as CustomEvent).detail as
          | { action?: string }
          | undefined;
        const action = detail?.action;
        if (!action) return;

        if (action === "maximize") {
          // Support double-press to go full height: if maximize is triggered twice
          // within a short interval, expand to near-fullscreen.
          const now = Date.now();
          if (now - lastMaximizeAtRef.current < 800) {
            maximizeCountRef.current += 1;
          } else {
            maximizeCountRef.current = 1;
          }
          lastMaximizeAtRef.current = now;

          if (maximizeCountRef.current >= 2) {
            // go full height
            try {
              prevHeightRef.current = height;
            } catch {}
            const full = Math.max(200, window.innerHeight - 80);
            setIsMinimized(false);
            setHeight(full);
            maximizeCountRef.current = 0;
          } else {
            // Restore last-used non-minimized height (prefer persisted value)
            try {
              const saved = localStorage.getItem("console_panel_height");
              const parsed = saved
                ? parseInt(saved, 10)
                : prevHeightRef.current || 320;
              const restore = Math.max(
                120,
                Math.min(window.innerHeight - 100, parsed)
              );
              setIsMinimized(false);
              setHeight(restore);
            } catch (e) {
              const restore = Math.max(
                120,
                Math.min(window.innerHeight - 100, prevHeightRef.current || 320)
              );
              setIsMinimized(false);
              setHeight(restore);
            }
          }
        } else if (action === "minimize") {
          try {
            prevHeightRef.current = height;
          } catch {}
          setHeight(MINIMIZED_HEIGHT);
          setIsMinimized(true);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("console-shortcut", handler as EventListener);
    return () =>
      window.removeEventListener("console-shortcut", handler as EventListener);
  }, [isOpen, height]);

  useEffect(() => {
    try {
      if (isOpen) {
        document.documentElement.style.setProperty(
          "--console-height",
          `${height}px`
        );
      } else {
        document.documentElement.style.setProperty("--console-height", `0px`);
      }
    } catch (e) {}
    return () => {
      try {
        document.documentElement.style.setProperty("--console-height", `0px`);
      } catch (e) {}
    };
  }, [height, isOpen]);

  const onStartResize = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isMinimized) return;
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;

    const onMove = (ev: PointerEvent) => {
      if (!resizingRef.current) return;
      const dy = startYRef.current - ev.clientY;
      const newHeight = Math.min(
        Math.max(120, startHeightRef.current + dy),
        Math.max(120, window.innerHeight - 80)
      );
      setHeight(newHeight);
    };

    const onUp = () => {
      resizingRef.current = false;
      setIsResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    setIsResizing(true);
  };

  if (!isOpen) return null;

  return (
    <div className="bottom-0 left-0 right-0 flex-none">
      <div
        className="relative border-t shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'rgb(from var(--text-primary) r g b / 0.1)',
          height,
          transition: isResizing
            ? "none"
            : "height 220ms cubic-bezier(.2,.8,.2,1)",
          willChange: "height",
        }}
      >
        {!isMinimized && (
          <div
            className="absolute left-0 right-0 h-3 -top-2 cursor-ns-resize"
            onPointerDown={onStartResize}
            aria-hidden
          />
        )}

        {/* Header */}
        <div className="h-6 bg-[var(--surface)] border-b border-neutral-700 flex items-center justify-between px-4 text-xs text-[var(--text-secondary)] relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: 'rgb(from var(--text-primary) r g b / 0.03)' }}
          />
          <h2 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] relative z-10">
            <Terminal size={16} className="text-[var(--text-secondary)]" />
            <span className="leading-none">{t("menu.console")}</span>
          </h2>
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={() => {
                if (!isMinimized) {
                  prevHeightRef.current = height;
                  try {
                    localStorage.setItem(
                      "console_panel_height",
                      String(prevHeightRef.current)
                    );
                  } catch (e) {}
                  setHeight(MINIMIZED_HEIGHT);
                  setIsMinimized(true);
                } else {
                  try {
                    const saved = localStorage.getItem("console_panel_height");
                    const parsed = saved
                      ? parseInt(saved, 10)
                      : prevHeightRef.current || 320;
                    const restore = Math.max(
                      120,
                      Math.min(window.innerHeight - 100, parsed)
                    );
                    setHeight(restore);
                  } catch (e) {
                    const restore = Math.max(
                      120,
                      Math.min(
                        window.innerHeight - 100,
                        prevHeightRef.current || 320
                      )
                    );
                    setHeight(restore);
                  }
                  setIsMinimized(false);
                }
              }}
              className="p-1 transition-colors rounded-lg"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(from var(--text-primary) r g b / 0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              aria-label={isMinimized ? "Restore console" : "Minimize console"}
            >
              {isMinimized ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 transition-colors rounded-lg"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(from var(--text-primary) r g b / 0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <X size={10} />
            </button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden bg-[var(--background)] ${isMinimized ? 'hidden' : ''}`}>
          <ConsoleConfig
            loadingAI={loadingAI}
            author={author}
            currentView={currentView}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsoleView;
