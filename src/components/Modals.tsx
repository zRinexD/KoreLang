import React, { useEffect } from "react";
import SettingsModal from "./SettingsModal";
import ConstraintsModal from "./ConstraintsModal";
import ProjectWizard from "./ProjectWizard";
import AboutModal from "./AboutModal";
import WhatsNewModal from "./WhatsNewModal";
import { UIContextValue } from "../ui/UIContext";
import { AppSettings } from "../types";
import { UIModal } from "../ui/types";

interface ModalsProps {
  modals: {
    ui: UIContextValue;
    handlers: Record<string, () => void>;
  };
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  projectStates: any; // Passed from App's useProject
}

export const Modals: React.FC<ModalsProps> = ({ modals, settings, updateSettings, projectStates }) => {
  useEffect(() => {
    const keys: UIModal[] = ["settings", "constraints", "wizard", "about", "whatsNew"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        keys.forEach((key) => {
          if (modals.ui.isOpen(key)) modals.ui.close(key);
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modals.ui]);

  return (
    <>
      <SettingsModal settings={settings} updateSettings={updateSettings} />
      <ConstraintsModal />
      <ProjectWizard {...projectStates} />
      <AboutModal />
      <WhatsNewModal />
    </>
  );
};
