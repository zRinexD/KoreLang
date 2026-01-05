import React, { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  position?: { x: number; y: number };
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  isOpen,
  onClose,
  anchorEl,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPosition = () => {
    if (position) return { top: position.y, left: position.x };
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      return { top: rect.bottom + 4, left: rect.left };
    }
    return { top: 0, left: 0 };
  };

  const pos = getPosition();

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[120px] rounded-lg border shadow-lg"
      style={{
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }}
          disabled={item.disabled}
          className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-[var(--elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: item.variant === "danger" ? "var(--error)" : "var(--text-primary)",
          }}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
