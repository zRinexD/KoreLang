import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface HeaderActionsProps {
  actions?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  closeLabel?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  actions,
  onClose,
  showCloseButton = true,
  closeLabel = "Close",
}) => {
  if (!actions && (!showCloseButton || !onClose)) return null;

  return (
    <div className="flex items-center gap-2">
      {actions}
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="rounded p-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
