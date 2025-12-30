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
import { MonoToggle } from "./ui";

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
        { type: "separator" },
        {
          label: t("menu.console"),
          icon: Terminal,
          action: openConsole,
          shortcut: "Alt+C",
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
          shortcut: "Alt+,",
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

  return (
    <header
      className="z-50 flex items-center h-10 px-2 border-b select-none"
      style={{
        backgroundColor: "var(--secondary)",
        borderColor: "var(--border)",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <div
        className="flex items-center gap-2 px-2 font-bold me-4"
        style={{ color: "var(--accent)" }}
      >
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
              className={`h-full px-3 text-sm flex items-center gap-1 transition-colors`}
              style={{
                backgroundColor:
                  activeMenu === menu.id ? "var(--accent)" : undefined,
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) =>
                activeMenu !== menu.id &&
                (e.currentTarget.style.backgroundColor = "var(--surface)")
              }
              onMouseLeave={(e) =>
                activeMenu !== menu.id &&
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
                <div
                  className="absolute z-50 w-56 py-1 border shadow-xl start-0 top-full rounded-b-md"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  {menu.items.map((item, idx) => {
                    if (item.type === "separator")
                      return (
                        <div
                          key={idx}
                          className="h-px mx-2 my-1"
                          style={{ backgroundColor: "var(--divider)" }}
                        />
                      );
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-1.5 text-sm flex items-center justify-between group"
                        style={{ color: "var(--text-primary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--accent)";
                          e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onClick={() => {
                          item.action();
                          setActiveMenu(null);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              size={14}
                              style={{ color: "var(--text-secondary)" }}
                            />
                          )}
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
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
          <MonoToggle
            active={isScriptMode}
            onClick={toggleScriptMode}
            icon={
              <Feather
                size={14}
                className={isScriptMode ? "animate-pulse" : ""}
              />
            }
            label="Script Mode"
            title="Toggle Native Neural-Glyph Rendering"
            color="var(--primary)"
          />
        )}
      </div>
    </header>
  );
};

export default MenuBar;
