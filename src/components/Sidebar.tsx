import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  BookA,
  GitBranch,
  Languages,
  LayoutDashboard,
  Activity,
  Feather,
  BookOpen,
  SidebarOpen,
} from "lucide-react";
import { ViewState } from "../types";
import { useTranslation } from "../i18n";
import { CompactButton } from "./ui";

export interface SidebarHandle {
  toggle: () => void;
  open: () => void;
  close: () => void;
}

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar = forwardRef<SidebarHandle, SidebarProps>(
  ({ currentView, setView }, ref) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen((o) => !o);

    // Expose toggle, open, and close functions to parent
    useImperativeHandle(ref, () => ({
      toggle: toggleSidebar,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const authoringItems = [
      { id: "DASHBOARD", label: t("nav.dashboard"), icon: LayoutDashboard },
      { id: "PHONOLOGY", label: t("nav.phonology"), icon: Activity },
      { id: "SCRIPT", label: t("nav.script"), icon: Feather },
      { id: "LEXICON", label: t("nav.lexicon"), icon: BookA },
      { id: "GRAMMAR", label: t("nav.grammar"), icon: Languages },
      { id: "GENEVOLVE", label: t("nav.genevolve"), icon: GitBranch },
      { id: "NOTEBOOK", label: t("nav.notebook"), icon: BookOpen },
    ];

    const renderItem = (item: any) => {
      const Icon = item.icon;
      const isActive = currentView === item.id;

      return (
        <li key={item.id}>
          <button
            onClick={() => setView(item.id as ViewState)}
            className={`flex items-center rounded-sm text-sm font-medium transition-all w-full
              ${
                isActive
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
            style={{
              backgroundColor: isActive ? 'var(--elevated)' : undefined,
              borderLeft: isActive ? '3px solid var(--accent)' : '2px solid transparent',
              padding: isOpen ? "8px 12px" : "8px",
              paddingLeft: isOpen ? (isActive ? '10px' : '12px') : (isActive ? '4px' : '8px'),
              justifyContent: isOpen ? "flex-start" : "center",
            }}
            onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'rgb(from var(--accent) r g b / 0.1)')}
            onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
            title={!isOpen ? item.label : undefined}
          >
            <Icon
              size={16}
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
            />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </button>
        </li>
      );
    };

    return (
      <aside
        className={`flex flex-col h-full shrink-0 bg-[var(--surface)] border-e border-neutral-700 transition-all duration-200
          ${isOpen ? "w-64" : "w-10"}`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between ${isOpen ? "px-4" : "p-1"}`}>
          {isOpen && (
            <div className="py-4">
              <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-blue-500">
                <span className="text-xl">⚡</span>
                {t("app.title")}
              </h1>
              <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold ms-7 flex items-center gap-2">
                {t("app.subtitle")}
                <span className="text-[11px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700 lowercase font-mono">
                  v1.1
                </span>
              </p>
            </div>
          )}

          <CompactButton
            onClick={toggleSidebar}
            variant="ghost"
            color="var(--text-secondary)"
            icon={isOpen ? <span className="text-sm">«</span> : <SidebarOpen size={18} />}
            label=""
            className="p-1"
          />
        </div>

        <div className="flex justify-center mb-1.5">
          <div className={`${isOpen ? "w-full" : "w-6"} h-px bg-neutral-700`}></div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 gap-6 py-4 overflow-y-auto">
          <nav>
            {isOpen && (
              <div className="px-4 mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-500">
                Authoring
              </div>
            )}
            <ul className={`space-y-0.5 ${isOpen ? 'px-2' : 'px-0'}`}>{authoringItems.map(renderItem)}</ul>
          </nav>
        </div>
      </aside>
    );
  }
);

export default Sidebar;
