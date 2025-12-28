import React, { useState } from "react";
import {
  FileText,
  FolderOpen,
  Settings,
  Download,
  HelpCircle,
  Command,
  ShieldCheck,
  Feather,
  Info,
  Terminal,
  LucideIcon,
} from "lucide-react";
import { AppSettings } from "../types";
import { useTranslation } from "../i18n";

interface MenuItem {
  label: string;
  icon?: LucideIcon;
  action: () => void;
  shortcut?: string;
  type?: never;
}

interface MenuSeparator {
  type: "separator";
  label?: never;
  icon?: never;
  action?: never;
  shortcut?: never;
}

type MenuEntry = MenuItem | MenuSeparator;

interface MenuGroup {
  id: string;
  label: string;
  items: MenuEntry[];
}
interface MenuBarProps {
  newProject: () => void;
  openProject: () => void;
  exportProject: () => void;
  openSettings: () => void;
  openProjectSettings: () => void;
  openConstraints: () => void;
  openConsole: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  onToggleSidebar: () => void;
  toggleScriptMode?: () => void;
  openAbout: () => void;
  settings: AppSettings;
  isScriptMode: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({
  newProject,
  openProject,
  exportProject,
  openSettings,
  openProjectSettings,
  openConstraints,
  openConsole,
  zoomIn,
  zoomOut,
  onToggleSidebar,
  toggleScriptMode,
  openAbout,
  settings,
  isScriptMode,
}) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      openProject();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveMenu(null);
  };


  const menuItems: MenuGroup[] = [
    {
      id: "file",
      label: t("menu.file"),
      items: [
        {
          label: t("menu.new_project"),
          icon: FileText,
          action: newProject,
          shortcut: "Alt+N",
        },
        {
          label: t("menu.open_project"),
          icon: FolderOpen,
          action: openProject,
          shortcut: "Alt+O",
        },
        { type: "separator" },
        {
          label: t("menu.export_json"),
          icon: Download,
          action: exportProject,
          shortcut: "Alt+E",
        },
      ],
    },
    {
      id: "view",
      label: t("menu.view"),
      items: [
        {
          label: t("menu.toggle_sidebar"),
          icon: Command,
          action: onToggleSidebar,
          shortcut: "Alt+B",
        },
        { label: t("menu.zoom_in"), action: zoomIn, shortcut: "Alt+" },
        {
          label: t("menu.zoom_out"),
          action: zoomOut,
          shortcut: "Alt-",
        },
      ],
    },
    {
      id: "tools",
      label: t("menu.tools"),
      items: [
        {
          label: t("menu.validation"),
          icon: ShieldCheck,
          action: openConstraints,
        },
        {
          label: t("menu.console"),
          icon: Terminal,
          action: openConsole,
          shortcut: "Alt+C",
        },
      ],
    },
    {
      id: "settings",
      label: t("menu.settings"),
      items: [
        {
          label: t("menu.project"),
          icon: Info,
          action: openProjectSettings,
        },
        {
          label: t("menu.preferences"),
          icon: Settings,
          action: openSettings,
        },
      ],
    },
    {
      id: "help",
      label: t("menu.help"),
      items: [
        {
          label: t("menu.docs"),
          icon: HelpCircle,
          action: () =>
            window.open("https://github.com/zRinexD/KoreLang/", "_blank"),
        },
        { label: t("menu.about"), action: () => openAbout?.() },
      ],
    },
  ];

  const getThemeLabel = () => {
    switch (settings.theme) {
      case "dark":
        return t("settings.dark");
      case "light":
        return t("settings.light");
      case "tokyo-night":
        return t("settings.tokyo");
      case "tokyo-light":
        return t("settings.tokyo_light");
      default:
        return t("settings.dark");
    }
  };

  return (
    <header className="z-50 flex items-center h-10 px-2 border-b select-none bg-neutral-950 border-neutral-800">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <div className="flex items-center gap-2 px-2 font-bold text-blue-500 me-4">
        <span>⚡ KL</span>
      </div>

      <div className="flex h-full">
        {menuItems.map((menu) => (
          <div
            key={menu.id}
            className="relative h-full"
            onMouseEnter={() => activeMenu && setActiveMenu(menu.id)}
          >
            <button
              className={`h-full px-3 text-sm flex items-center gap-1 transition-colors ${
                activeMenu === menu.id
                  ? "bg-blue-700 text-white"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
              onClick={() =>
                setActiveMenu(activeMenu === menu.id ? null : menu.id)
              }
            >
              {menu.label}
            </button>
            {activeMenu === menu.id && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />
                <div className="absolute z-50 w-56 py-1 border shadow-xl start-0 top-full bg-neutral-900 border-neutral-700 rounded-b-md">
                  {menu.items.map((item, idx) => {
                    if (item.type === "separator")
                      return (
                        <div
                          key={idx}
                          className="h-px mx-2 my-1 bg-neutral-700"
                        />
                      );
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-1.5 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white flex items-center justify-between group"
                        onClick={() => {
                          item.action();
                          setActiveMenu(null);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              size={14}
                              className="text-neutral-500 group-hover:text-white"
                            />
                          )}
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <span className="text-xs text-neutral-500 group-hover:text-blue-100">
                            {item.shortcut}
                          </span>
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

      <div className="flex items-center gap-4">
        {toggleScriptMode && (
          <button
            onClick={toggleScriptMode}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all border ${
              isScriptMode
                ? "bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                : "bg-neutral-900 text-neutral-500 border-neutral-700 hover:text-neutral-300"
            }`}
            title="Toggle Native Neural-Glyph Rendering"
          >
            <Feather
              size={14}
              className={isScriptMode ? "animate-pulse" : ""}
            />
            <span className="hidden sm:inline">Script Mode</span>
          </button>
        )}
        <div className="w-px h-4 bg-neutral-800" />
        <div className="mr-2 text-xs text-neutral-500">
          {t("menu.env")}: {getThemeLabel()}
        </div>
      </div>
    </header>
  );
};

export default MenuBar;
