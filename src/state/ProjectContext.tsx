import React, { createContext, useContext } from "react";
import { useProject } from "../hooks/useProject";
import {
  LexiconEntry,
  MorphologyState,
  PhonologyConfig,
  SoundChangeRule,
  ProjectConstraints,
  ScriptConfig,
  ProjectData,
  ViewState,
  AppSettings,
} from "../types";

// 1. Définir le type du contexte
export interface ProjectContextType extends ReturnType<typeof useProject> {}

// 2. Créer le contexte
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// 3. Provider qui encapsule useProject
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const project = useProject();
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
};

// 4. Hook pour consommer le contexte
export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used within a ProjectProvider");
  return ctx;
}
