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

export interface SidebarHandle {
  toggle: () => void;
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

    // Expose only toggle function to parent
    useImperativeHandle(ref, () => ({
      toggle: toggleSidebar,
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
            className={`flex items-center rounded-sm text-sm font-medium transition-all border-l-2 w-full
              ${
                isActive
                  ? "text-white border-transparent"
                  : "text-neutral-400 hover:text-neutral-100 border-transparent"
              }`}
            style={{
              backgroundColor: isActive ? 'var(--accent)' : undefined,
              padding: isOpen ? "8px 12px" : "8px 0",
              justifyContent: isOpen ? "flex-start" : "center",
            }}
            onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'var(--bg-panel)')}
            onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
            title={!isOpen ? item.label : undefined}
          >
            <Icon
              size={16}
              className={isActive ? "text-white" : "text-neutral-500"}
            />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </button>
        </li>
      );
    };

    return (
      <aside
        className={`flex flex-col h-full shrink-0 bg-[var(--bg-panel)] border-e border-neutral-700 transition-all duration-200
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

          <button
            onClick={toggleSidebar}
            className="p-1 transition-colors text-neutral-500 hover:text-white"
            title={t("menu.toggle_sidebar")}
          >
            {isOpen ? "«" : <SidebarOpen size={20} />}
          </button>
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
            <ul className="space-y-0.5 px-2">{authoringItems.map(renderItem)}</ul>
          </nav>
        </div>
      </aside>
    );
  }
);

export default Sidebar;
