import React, { useState, useRef } from 'react';
import {
  FileText, FolderOpen, Settings,
  Download, HelpCircle, Command, ShieldCheck, Feather
} from 'lucide-react';
import { AppSettings } from '../types';
import { useTranslation } from '../i18n';

interface MenuBarProps {
  onNewProject: () => void;
  onOpenProject: (file: File) => void;
  onSaveProject: () => void;
  onOpenSettings: () => void;
  onOpenConstraints: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleSidebar: () => void;
  settings: AppSettings;
  isScriptMode?: boolean; // NEW PROP
  onToggleScriptMode?: () => void; // NEW PROP
  onOpenAbout?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onOpenSettings,
  onOpenConstraints,
  onZoomIn,
  onZoomOut,
  onToggleSidebar,
  settings,
  isScriptMode,
  onToggleScriptMode,
  onOpenAbout
}) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onOpenProject(e.target.files[0]);
    }
    // Reset to allow selecting same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveMenu(null);
  };

  const menuItems = [
    {
      id: 'file',
      label: t('menu.file'),
      items: [
        { label: t('menu.new_project'), icon: FileText, action: onNewProject, shortcut: 'Alt+N' },
        { label: t('menu.open_project'), icon: FolderOpen, action: () => fileInputRef.current?.click(), shortcut: 'Alt+O' },
        { type: 'separator' },
        { label: t('menu.export_json'), icon: Download, action: onSaveProject, shortcut: 'Alt+S' },
      ]
    },
    {
      id: 'view',
      label: t('menu.view'),
      items: [
        { label: t('menu.toggle_sidebar'), icon: Command, action: onToggleSidebar, shortcut: 'Alt+B' }, // CORRECTED SHORTCUT
        { label: t('menu.zoom_in'), action: onZoomIn, shortcut: 'Alt+' }, // CORRECTED SHORTCUT
        { label: t('menu.zoom_out'), action: onZoomOut, shortcut: 'Alt-' }, // CORRECTED SHORTCUT
      ]
    },
    {
      id: 'tools',
      label: t('menu.tools'),
      items: [
        { label: t('menu.validation'), icon: ShieldCheck, action: onOpenConstraints, shortcut: '' },
      ]
    },
    {
      id: 'settings',
      label: t('menu.settings'),
      items: [
        { label: t('menu.preferences'), icon: Settings, action: onOpenSettings, shortcut: 'Ctrl+,' },
      ]
    },
    {
      id: 'help',
      label: t('menu.help'),
      items: [
        { label: t('menu.docs'), icon: HelpCircle, action: () => window.open('https://github.com/zRinexD/KoreLang/', '_blank') },
        { label: t('menu.about'), action: () => onOpenAbout?.() },
      ]
    }
  ];

  const getThemeLabel = () => {
    switch (settings.theme) {
      case 'dark': return t('settings.dark');
      case 'light': return t('settings.light');
      case 'tokyo-night': return t('settings.tokyo');
      case 'tokyo-light': return t('settings.tokyo_light');
      default: return t('settings.dark');
    }
  };

  return (
    <header className="h-10 bg-neutral-950 border-b border-neutral-800 flex items-center px-2 select-none z-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />

      {/* Logo Area - me-4 (margin-end) flips margin for RTL */}
      <div className="me-4 flex items-center gap-2 text-blue-500 font-bold px-2">
        <span>⚡ KL</span>
      </div>

      {/* Menu Items */}
      <div className="flex h-full">
        {menuItems.map((menu) => (
          <div
            key={menu.id}
            className="relative h-full"
            onMouseEnter={() => activeMenu && setActiveMenu(menu.id)}
          >
            <button
              className={`h-full px-3 text-sm flex items-center gap-1 transition-colors ${activeMenu === menu.id
                ? 'bg-blue-700 text-white'
                : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
            >
              {menu.label}
            </button>

            {activeMenu === menu.id && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />
                {/* start-0 (left in LTR, right in RTL) ensures alignment matches direction */}
                <div className="absolute start-0 top-full w-56 bg-neutral-900 border border-neutral-700 shadow-xl rounded-b-md z-50 py-1">
                  {menu.items.map((item, idx) => {
                    if (item.type === 'separator') {
                      return <div key={idx} className="h-px bg-neutral-700 my-1 mx-2" />;
                    }
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-1.5 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white flex items-center justify-between group"
                        onClick={() => {
                          item.action?.();
                          setActiveMenu(null);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && <Icon size={14} className="text-neutral-500 group-hover:text-white" />}
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <span className="text-xs text-neutral-500 group-hover:text-blue-100">{item.shortcut}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Right Side Tools */}
      <div className="flex items-center gap-4">

        {/* GLOBAL SCRIPT TOGGLE */}
        {onToggleScriptMode && (
          <button
            onClick={onToggleScriptMode}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all border ${isScriptMode
              ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'bg-neutral-900 text-neutral-500 border-neutral-700 hover:text-neutral-300'
              }`}
            title="Toggle Native Neural-Glyph Rendering"
          >
            <Feather size={14} className={isScriptMode ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">Script Mode</span>
          </button>
        )}

        <div className="h-4 w-px bg-neutral-800"></div>

        <div className="text-xs text-neutral-500 mr-2">{t('menu.env')}: {getThemeLabel()}</div>
      </div>
    </header>
  );
};

export default MenuBar;