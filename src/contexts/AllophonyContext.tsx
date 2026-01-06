import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { AllophonyRule } from "../types/allophony";

interface AllophonyContextType {
  allophonyRules: AllophonyRule[];
  updateAllophonyRules: (rules: AllophonyRule[]) => void;
  addRule: (rule: AllophonyRule) => void;
  updateRule: (id: string, rule: AllophonyRule) => void;
  deleteRule: (id: string) => void;
  clearRules: () => void;
}

const AllophonyContext = createContext<AllophonyContextType | undefined>(undefined);

interface AllophonyProviderProps {
  children: ReactNode;
  initialRules?: AllophonyRule[];
}

export const AllophonyProvider: React.FC<AllophonyProviderProps> = ({
  children,
  initialRules = [],
}) => {
  const [allophonyRules, setAllophonyRules] = React.useState<AllophonyRule[]>(
    initialRules
  );

  // Keep context state in sync if parent passes new initialRules (e.g., after project load)
  React.useEffect(() => {
    setAllophonyRules(initialRules);
  }, [initialRules]);

  const updateAllophonyRules = useCallback((rules: AllophonyRule[]) => {
    setAllophonyRules(rules);
  }, []);

  const addRule = useCallback((rule: AllophonyRule) => {
    setAllophonyRules((prev) => [...prev, rule]);
  }, []);

  const updateRule = useCallback((id: string, rule: AllophonyRule) => {
    setAllophonyRules((prev) =>
      prev.map((r) => (r.id === id ? rule : r))
    );
  }, []);

  const deleteRule = useCallback((id: string) => {
    setAllophonyRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearRules = useCallback(() => {
    setAllophonyRules([]);
  }, []);

  const value: AllophonyContextType = {
    allophonyRules,
    updateAllophonyRules,
    addRule,
    updateRule,
    deleteRule,
    clearRules,
  };

  return (
    <AllophonyContext.Provider value={value}>
      {children}
    </AllophonyContext.Provider>
  );
};

export const useAllophony = (): AllophonyContextType => {
  const context = useContext(AllophonyContext);
  if (!context) {
    throw new Error("useAllophony must be used within AllophonyProvider");
  }
  return context;
};
