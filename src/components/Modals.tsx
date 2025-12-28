import React, { useState } from "react";
import SettingsModal from "./SettingsModal";
import ConstraintsModal from "./ConstraintsModal";
import ProjectWizard from "./ProjectWizard";
import AboutModal from "./AboutModal";
import WhatsNewModal from "./WhatsNewModal";
import { UIContextValue } from "../ui/UIContext";

interface ModalsProps {
  modals: {
    ui: UIContextValue;
    handlers: Record<string, () => void>;
  };
}

export const Modals: React.FC<ModalsProps> = ({ modals }) => {
  return (
    <>
      <SettingsModal />
      <ConstraintsModal />
      <ProjectWizard />
      <AboutModal />
      <WhatsNewModal />
    </>
  );
};
