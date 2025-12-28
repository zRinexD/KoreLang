import React, { useState, useEffect, useRef } from "react";
import Sidebar, { SidebarHandle } from "./components/Sidebar";
import MenuBar from "./components/MenuBar";
import Lexicon from "./components/Lexicon";
import GrammarEditor from "./components/GrammarEditor";
import GenEvolve from "./components/GenEvolve";
import PhonologyEditor from "./components/PhonologyEditor";
import Dashboard from "./components/Dashboard";
import ConsoleView from "./components/ConsoleView";
import ScriptEditor from "./components/ScriptEditor";
import Notebook from "./components/Notebook";
import ProjectWizard from "./components/ProjectWizard";
import ConstraintsModal from "./components/ConstraintsModal";
import AboutModal from "./components/AboutModal";
import SettingsModal from "./components/SettingsModal";
import WhatsNewModal from "./components/WhatsNewModal";

import { useShortcuts } from "./hooks/useShorcuts";
import { useTheme } from "./hooks/useTheme";
import { useProject } from "./hooks/useProject";

import {
  ViewState,
  LexiconEntry,
  LogEntry,
  AppSettings,
} from "./types";

import { LanguageProvider, i18n } from "./i18n";
import { UIProvider, useUI } from "./ui/UIContext";
import { useWhatsNewOnBoot } from "./hooks/useWhatsNewOnBoot";

const SETTINGS_STORAGE_KEY = "conlang_studio_settings";

const AppContent: React.FC = () => {
  const ui = useUI();
  useWhatsNewOnBoot(ui);

  const [currentView, setCurrentView] = useState<ViewState>("DASHBOARD");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<"create" | "edit">("create");
  const [isScriptMode, setIsScriptMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [draftEntry, setDraftEntry] = useState<Partial<LexiconEntry> | null>(
    null
  );
  const [consoleHistory, setConsoleHistory] = useState<LogEntry[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const sidebarRef = useRef<SidebarHandle>(null);

  /*  ---------------- ACTION CALLBACKS ---------------- */
  const promptOpenProject = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        loadProjectData(JSON.parse(e.target?.result as string));
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const menuBarActions = {
    newProject: () => {
      setWizardMode("create");
      ui.open("wizard");
    },
    exportProject: () => {
      const data = getFullProjectData();
      const text = JSON.stringify(data, null, 2);
      const blob = new Blob([text], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${projectName.toLowerCase().replace(/\s/g, "-")}.json`;
      a.click();
    },
    openProject: promptOpenProject,
    openSettings: () => ui.open("settings"),
    openProjectSettings: () => {
      setWizardMode("edit");
      ui.open("wizard");
    },
    openConstraints: () => ui.open("constraints"),
    openConsole: () => setIsConsoleOpen(true),
    zoomIn: () => setZoomLevel((z) => Math.min(z + 10, 150)),
    zoomOut: () => setZoomLevel((z) => Math.max(z - 10, 50)),
    onToggleSidebar: () => sidebarRef.current?.toggle(),
    toggleScriptMode: () => setIsScriptMode((s) => !s),
    openAbout: () => ui.open("about"),
  };
  /* ---------------- PROJECT STATE (HOOK) ---------------- */

  const {
    projectName,
    setProjectName,
    projectAuthor,
    setProjectAuthor,
    projectDescription,
    setProjectDescription,
    lexicon,
    setLexicon,
    grammar,
    setGrammar,
    morphology,
    setMorphology,
    phonology,
    setPhonology,
    rules,
    setRules,
    constraints,
    setConstraints,
    scriptConfig,
    setScriptConfig,
    notebook,
    setNotebook,
    loadProjectData,
    getFullProjectData,
  } = useProject();

  /* ---------------- SETTINGS ---------------- */

  const [genWordState, setGenWordState] = useState<any>(null);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      theme: "dark",
      autoSave: true,
      showLineNumbers: true,
      enableAI: true,
      language: i18n.language,
    };
  });

  useTheme(settings.theme, settings.customTheme);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (settings.language && settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings]);

  /* ---------------- RESPONSIVE ---------------- */

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useShortcuts({
    isConsoleOpen,
    setIsConsoleOpen,
    onToggleSidebar: menuBarActions.onToggleSidebar,
    onNewProject: menuBarActions.newProject,
    onOpenProject: menuBarActions.openProject,
    onExportProject: menuBarActions.exportProject,
    onZoomIn: menuBarActions.zoomIn,
    onZoomOut: menuBarActions.zoomOut,
  });

  /* ---------------- VIEW RENDER ---------------- */

  const renderView = () => {
    switch (currentView) {
      case "DASHBOARD":
        return (
          <Dashboard
            entries={lexicon}
            projectName={projectName}
            author={projectAuthor}
            description={projectDescription}
            setView={setCurrentView}
            scriptConfig={scriptConfig}
            isScriptMode={isScriptMode}
          />
        );
      case "PHONOLOGY":
        return (
          <PhonologyEditor
            data={phonology}
            setData={setPhonology}
            enableAI={settings.enableAI}
          />
        );
      case "LEXICON":
        return (
          <Lexicon
            entries={lexicon}
            setEntries={setLexicon}
            constraints={constraints}
            enableAI={settings.enableAI}
            phonology={phonology}
            genWordState={genWordState}
            setGenWordState={setGenWordState}
            draftEntry={draftEntry}
            setDraftEntry={setDraftEntry}
            scriptConfig={scriptConfig}
            isScriptMode={isScriptMode}
          />
        );
      case "GRAMMAR":
        return (
          <GrammarEditor
            grammar={grammar}
            setGrammar={setGrammar}
            morphology={morphology}
            setMorphology={setMorphology}
            showLineNumbers={settings.showLineNumbers}
            scriptConfig={scriptConfig}
            isScriptMode={isScriptMode}
          />
        );
      case "GENEVOLVE":
        return (
          <GenEvolve
            entries={lexicon}
            onUpdateEntries={setLexicon}
            rules={rules}
            setRules={setRules}
            scriptConfig={scriptConfig}
            isScriptMode={isScriptMode}
          />
        );
      case "SCRIPT":
        return (
          <ScriptEditor
            scriptConfig={scriptConfig}
            setScriptConfig={setScriptConfig}
            constraints={constraints}
          />
        );
      case "NOTEBOOK":
        return (
          <Notebook
            text={notebook}
            setText={setNotebook}
            scriptConfig={scriptConfig}
            isScriptMode={isScriptMode}
          />
        );
      default:
        return null;
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-main)] text-[var(--text-1)] font-sans overflow-hidden transition-colors duration-200">
      <MenuBar
        actions={menuBarActions}
        settings={settings}
        isScriptMode={isScriptMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          ref={sidebarRef}
          currentView={currentView}
          setView={setCurrentView}
        />

        <main className="flex flex-col w-full h-full">
          <div
            className="flex-1 overflow-hidden"
            style={{ zoom: zoomLevel / 100 }}
          >
            {renderView()}
          </div>

          {isConsoleOpen && (
            <ConsoleView
              isOpen={isConsoleOpen}
              loadingAI={settings.enableAI}
              onClose={() => setIsConsoleOpen(false)}
              history={consoleHistory}
              setHistory={setConsoleHistory}
            />
          )}
        </main>
      </div>

      <footer className="h-6 bg-[var(--bg-panel)] border-t border-neutral-700 flex items-center px-4 text-xs text-[var(--text-2)] gap-4 shrink-0 z-50 relative">
        <span className="flex items-center gap-1 font-bold text-emerald-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Auto-Saved
        </span>
        <span className="text-neutral-400">{projectName}</span>
        <span className="text-neutral-500/80 font-mono text-[11px]">v1.1</span>
        <span className="ml-auto">Ln 1, Col 1</span>
        <span>{lexicon.length} Words</span>
        <span>AI: {settings.enableAI ? "READY" : "OFF"}</span>
      </footer>

      <SettingsModal />
      <ConstraintsModal />
      <ProjectWizard />
      <AboutModal />
      <WhatsNewModal />
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
