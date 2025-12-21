import React from 'react';
import { BookA, GitBranch, Languages, LayoutDashboard, Settings, Activity, Terminal, FileJson, Feather, BookOpen } from 'lucide-react';
import { ViewState } from '../types';
import { useTranslation } from '../i18n';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onOpenProjectSettings: () => void;
  onToggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onOpenProjectSettings, onToggleSidebar }) => {
  const { t } = useTranslation();

  const authoringItems = [
    { id: 'DASHBOARD', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'PHONOLOGY', label: t('nav.phonology'), icon: Activity },
    { id: 'SCRIPT', label: t('nav.script'), icon: Feather },
    { id: 'LEXICON', label: t('nav.lexicon'), icon: BookA },
    { id: 'GRAMMAR', label: t('nav.grammar'), icon: Languages },
    { id: 'GENEVOLVE', label: t('nav.genevolve'), icon: GitBranch },
    { id: 'NOTEBOOK', label: t('nav.notebook'), icon: BookOpen },
  ];

  const systemItems = [
    { id: 'CONSOLE', label: t('nav.console'), icon: Terminal },
    { id: 'SOURCE', label: t('nav.source'), icon: FileJson },
  ];

  const renderItem = (item: any) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => setView(item.id as ViewState)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all border-l-2 ${isActive
            ? 'bg-neutral-800 text-white border-blue-500'
            : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 border-transparent'
            }`}
        >
          <Icon size={16} className={isActive ? 'text-blue-400' : 'text-neutral-500'} />
          {item.label}
        </button>
      </li>
    );
  };

  return (
    <aside className="w-64 bg-[var(--bg-panel)] border-e border-neutral-700 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-neutral-700 flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold text-blue-500 tracking-tight flex items-center gap-2">
            <span className="text-xl">⚡</span>
            {t('app.title')}
          </h1>
          <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold ms-7 flex items-center gap-2">
            {t('app.subtitle')}
            <span className="text-[11px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700 lowercase font-mono">v1.0.0</span>
          </p>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-neutral-500 hover:text-white transition-colors p-1"
            title={t('menu.toggle_sidebar')}
          >
            {/* RTL awareness handled by parent or Lucide */}
            <span className="block rtl:rotate-180">«</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
        <nav>
          <div className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Authoring</div>
          <ul className="space-y-0.5 px-2">
            {authoringItems.map(renderItem)}
          </ul>
        </nav>

        <nav>
          <div className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">System</div>
          <ul className="space-y-0.5 px-2">
            {systemItems.map(renderItem)}
          </ul>
        </nav>
      </div>

      <div className="p-3 border-t border-neutral-700 bg-[var(--bg-panel)]">
        <button
          onClick={onOpenProjectSettings}
          className="flex items-center gap-3 text-neutral-400 hover:text-white text-sm font-medium w-full px-3 py-2 rounded hover:bg-neutral-800 transition-colors"
        >
          <Settings size={16} />
          {t('settings.title')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;