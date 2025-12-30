import { useUI } from "../ui/UIContext";

export const useModals = () => {
  const ui = useUI();

  const handlers = {
    openSettings: () => ui.open("settings"),
    openConstraints: () => ui.open("constraints"),
    openAbout: () => ui.open("about"),
  };

  return {
    ui,
    handlers,
  };
};
