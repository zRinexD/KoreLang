import React, { useEffect, useState } from "react";
import Sidebar, { SidebarHandle } from "./components/Sidebar";
import MenuBar from "./components/MenuBar";
import ConsoleView from "./components/ConsoleView";

import { useTheme } from "./hooks/useTheme";
import { useProject } from "./hooks/useProject";
import { useModals } from "./hooks/useModals";
import { useShortcuts } from "./hooks/useShorcuts";
import { ProjectView } from "./components/ProjectView";
import { Modals } from "./components/Modals";
import { Footer } from "./components/Footer";

import { ViewState, LogEntry } from "./types";

import { LanguageProvider, i18n } from "./i18n";
import { UIProvider, useUI } from "./ui/UIContext";
import {
  useCommandExecutor,
  useCommandRegister,
  resolveModal,
} from "./state/commandStore";
import { setApiKey as persistApiKey } from "./services/geminiService";



const AppContent: React.FC = () => {
  const project = useProject();
  useTheme(project.settings.theme, project.settings.customTheme);
  const modals = useModals();
  const { open } = useUI();
  const executeCommand = useCommandExecutor();
  const registerCommands = useCommandRegister();
  
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isScriptMode, setIsScriptMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [consoleHistory, setConsoleHistory] = useState<LogEntry[]>([]);
  const sidebarRef = React.useRef<SidebarHandle>(null);

  useEffect(() => {
    registerCommands({
      toggleSidebar: () => sidebarRef.current?.toggle(),
      openConsole: () => setIsConsoleOpen(true),
      closeConsole: () => setIsConsoleOpen(false),
      maximizeConsole: () => {
        setIsConsoleOpen(true);
        window.dispatchEvent(
          new CustomEvent("console-shortcut", { detail: { action: "maximize" } })
        );
      },
      minimizeConsole: () => {
        if (!isConsoleOpen) return;
        window.dispatchEvent(
          new CustomEvent("console-shortcut", { detail: { action: "minimize" } })
        );
      },
      newProject: () => open("wizard"),
      openProject: project.handlers.openProject,
      exportProject: project.handlers.exportProject,
      openModal: (payload) => {
        const modal = resolveModal(payload?.modal);
        if (modal) open(modal);
      },
      setLanguage: (payload) => {
        if (!payload?.language) return;
        i18n.changeLanguage(payload.language);
        project.updateSettings({
          ...project.settings,
          language: payload.language,
        });
      },
      setAIEnabled: (payload) => {
        if (payload?.aiEnabled === undefined) return;
        project.updateSettings({
          ...project.settings,
          enableAI: payload.aiEnabled,
        });
      },
      setApiKey: (payload) => {
        persistApiKey(payload?.apiKey || "");
      },
      setTheme: (payload) => {
        if (!payload?.theme) return;
        const customTheme = (payload.customTheme || project.settings.customTheme) as any;
        project.updateSettings({
          ...project.settings,
          theme: payload.theme,
          customTheme,
        });
      },
      updateCustomTheme: (payload) => {
        if (!payload?.colorKey || !payload?.colorValue) return;
        const current = project.settings.customTheme || { bgMain: "", bgPanel: "", text1: "", text2: "", accent: "" };
        project.updateSettings({
          ...project.settings,
          theme: "custom",
          customTheme: { ...current, [payload.colorKey]: payload.colorValue },
        });
      },
      toggleScriptMode: () => setIsScriptMode((s) => !s),
      zoomIn: () => setZoomLevel((z) => Math.min(z + 10, 150)),
      zoomOut: () => setZoomLevel((z) => Math.max(z - 10, 50)),
    });
  }, [
    registerCommands,
    open,
    project.handlers.openProject,
    project.handlers.exportProject,
    isConsoleOpen,
    project.settings,
    project.updateSettings,
  ]);

  // Setup keyboard shortcuts
  useShortcuts({
    isConsoleOpen,
    executeCommand,
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-main)]">
      <MenuBar 
        newProject={() => executeCommand("newProject")}
        openProject={() => executeCommand("openProject")}
        exportProject={() => executeCommand("exportProject")}
        openSettings={() => executeCommand("openModal", { modal: "settings" })}
        openProjectSettings={() => executeCommand("openModal", { modal: "wizard" })}
        openConstraints={() => executeCommand("openModal", { modal: "constraints" })}
        openConsole={() => executeCommand("openConsole")}
        zoomIn={() => executeCommand("zoomIn")}
        zoomOut={() => executeCommand("zoomOut")}
        toggleScriptMode={() => executeCommand("toggleScriptMode")}
        onToggleSidebar={() => executeCommand("toggleSidebar")}
        openAbout={() => executeCommand("openModal", { modal: "about" })}
        settings={project.settings} 
        isScriptMode={isScriptMode} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar ref={sidebarRef} {...project.sidebarProps} />
        <main className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden" style={{ zoom: zoomLevel / 100 }}>
            <ProjectView 
              currentView={project.currentView as ViewState} 
              {...project.states}
              isScriptMode={isScriptMode}
              setCurrentView={project.setCurrentView}
            />
          </div>
          {isConsoleOpen && (
            <ConsoleView
              isOpen={isConsoleOpen}
              loadingAI={project.settings.enableAI}
              onClose={() => setIsConsoleOpen(false)}
              history={consoleHistory}
              setHistory={setConsoleHistory}
            />
          )}
        </main>
      </div>
      <Modals modals={modals} settings={project.settings} updateSettings={project.updateSettings} />
      <Footer project={project} />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider i18n={i18n}>
    <UIProvider>
      <AppContent />
    </UIProvider>
  </LanguageProvider>
);

export default App;
