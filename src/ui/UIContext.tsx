import React, { createContext, useContext, useState } from "react";
import { UIModal, UIOverlay } from "./types";

type UIState = Partial<Record<UIModal, boolean>>;

export interface UIContextValue {
  state: UIState;
  open: (modal: UIModal) => void;
  close: (modal: UIModal) => void;
  toggle: (modal: UIModal) => void;
  isOpen: (modal: UIModal) => boolean;
}

const UIContext = createContext<UIContextValue | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UIState>({});

  const open = (modal: UIModal) =>
    setState((s) => ({ ...s, [modal]: true }));

  const close = (modal: UIModal) =>
    setState((s) => ({ ...s, [modal]: false }));

  const toggle = (modal: UIModal) =>
    setState((s) => ({ ...s, [modal]: !s[modal] }));

  const isOpen = (modal: UIModal) => !!state[modal];

  return (
    <UIContext.Provider value={{ state, open, close, toggle, isOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
};
