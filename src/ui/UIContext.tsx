import React, { createContext, useContext, useState } from "react";
import { UIModal } from "./types";

type UIState = Partial<Record<UIModal, boolean>>;
type OnCloseCallbacks = Partial<Record<UIModal, () => void>>;

export interface UIContextValue {
  open: (modal: UIModal, onClose?: () => void) => void;
  close: (modal: UIModal) => void;
  toggle: (modal: UIModal) => void;
  isOpen: (modal: UIModal) => boolean;
}

const UIContext = createContext<UIContextValue | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UIState>({});
  const [onCloseCallbacks, setOnCloseCallbacks] = useState<OnCloseCallbacks>({});

  const open = (modal: UIModal, onClose?: () => void) => {
    setState((s) => ({ ...s, [modal]: true }));
    if (onClose) setOnCloseCallbacks((c) => ({ ...c, [modal]: onClose }));
  };

  const close = (modal: UIModal) => {
    setState((s) => ({ ...s, [modal]: false }));
    onCloseCallbacks[modal]?.(); 
    setOnCloseCallbacks((c) => ({ ...c, [modal]: undefined }));
  };

  const toggle = (modal: UIModal) =>
    setState((s) => ({ ...s, [modal]: !s[modal] }));

  const isOpen = (modal: UIModal) => !!state[modal];

  return (
    <UIContext.Provider value={{ open, close, toggle, isOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
};
