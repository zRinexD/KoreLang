import { create } from "zustand";
import { UIModal } from "../ui/types";

export type CommandId =
  | "toggleSidebar"
  | "openSidebar"
  | "closeSidebar"
  | "openConsole"
  | "closeConsole"
  | "maximizeConsole"
  | "minimizeConsole"
  | "newProject"
  | "openProject"
  | "openProjectWizard"
  | "loadProject"
  | "exportProject"
  | "openModal"
  | "toggleScriptMode"
  | "zoomIn"
  | "zoomOut"
  | "setLanguage"
  | "setAIEnabled"
  | "setApiKey"
  | "setTheme"
  | "updateCustomTheme"
  | "navigateTo"
  | "addLexiconEntry"
  | "deleteLexiconEntry"
  | "searchLexicon";

export type CommandPayload = {
  modal?: UIModal | string;
  language?: string;
  aiEnabled?: boolean;
  apiKey?: string;
  theme?: "dark" | "cappuccino" | "tokyo-night" | "custom";
  customTheme?: Record<string, string>;
  colorKey?: string;
  colorValue?: string;
  view?: string;
  word?: string;
  pos?: string;
  definition?: string;
  ipa?: string;
  etymology?: string;
  derivedFrom?: string;
  timestamp?: number;
  query?: string;
  name?: string;
  author?: string;
  description?: string;
  fileName?: string;
  path?: string;
  data?: any;
};

export type CommandHandlers = Partial<
  Record<CommandId, (payload?: CommandPayload) => void>
>;

interface CommandStore {
  handlers: CommandHandlers;
  register: (entries: CommandHandlers) => void;
  execute: (id: CommandId, payload?: CommandPayload) => void;
}

const modalAliases: Record<string, UIModal> = {
  about: "about",
  settings: "settings",
  constraints: "constraints",
  wizard: "wizard",
  new: "wizard",
  whatsnew: "whatsNew",
  "whats-new": "whatsNew",
};

export const resolveModal = (name?: string | UIModal): UIModal | undefined => {
  if (!name) return undefined;
  if (typeof name !== "string") return name;
  const key = name.trim().toLowerCase();
  return modalAliases[key];
};

export const useCommandStore = create<CommandStore>((set, get) => ({
  handlers: {},
  register: (entries) =>
    set((state) => ({ handlers: { ...state.handlers, ...entries } })),
  execute: (id, payload) => {
    const handler = get().handlers[id];
    if (handler) {
      handler(payload);
    } else if (typeof console !== "undefined") {
      console.warn(`[command] no handler registered for ${id}`);
    }
  },
}));

export const useCommandExecutor = () => useCommandStore((s) => s.execute);
export const useCommandRegister = () => useCommandStore((s) => s.register);
