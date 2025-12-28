import React, { useState } from "react";
import SettingsModal from "./SettingsModal";
import ConstraintsModal from "./ConstraintsModal";
import ProjectWizard from "./ProjectWizard";
import AboutModal from "./AboutModal";
import WhatsNewModal from "./WhatsNewModal";
import { UIContextValue } from "../ui/UIContext";
import { AppSettings } from "../types";

interface ModalsProps {
  modals: {
    ui: UIContextValue;
    handlers: Record<string, () => void>;
  };
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
}

export const Modals: React.FC<ModalsProps> = ({ modals, settings, updateSettings }) => {
  return (
    <>
      <SettingsModal settings={settings} updateSettings={updateSettings} />
      <ConstraintsModal />
      <ProjectWizard />
      <AboutModal />
      <WhatsNewModal />
    </>
  );
};
