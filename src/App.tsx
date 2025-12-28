import React from "react";
import Sidebar from "./components/Sidebar";
import MenuBar from "./components/MenuBar";

import { useTheme } from "./hooks/useTheme";
import { useProject } from "./hooks/useProject";
import { useModals } from "./hooks/useModals";
import { ProjectView } from "./components/ProjectView";
import { Modals } from "./components/Modals";
import { Footer } from "./components/Footer";

import { ViewState } from "./types";

import { LanguageProvider, i18n } from "./i18n";
import { UIProvider } from "./ui/UIContext";



const AppContent: React.FC = () => {
  const project = useProject();
  const theme = useTheme(project.settings.theme, project.settings.customTheme);
  const modals = useModals();

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-main)]">
      <MenuBar {...project.handlers} {...modals.handlers} settings={project.settings} isScriptMode={false} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar {...project.sidebarProps} />
        <main className="flex-1 overflow-hidden">
          <ProjectView currentView={project.currentView as ViewState} {...project.states} />
        </main>
      </div>
      <Modals modals={modals} />
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
