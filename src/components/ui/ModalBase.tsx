import React, { ReactNode, MouseEvent } from "react";
import { HeaderActions } from "./HeaderActions.tsx";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  hideFooter?: boolean;
  closeOnOverlayClick?: boolean;
  headerActions?: ReactNode;
  closeLabel?: string;
}

export const ModalBase: React.FC<ModalBaseProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = "max-w-lg",
  showCloseButton = true,
  hideFooter = false,
  closeOnOverlayClick = true,
  headerActions,
  closeLabel = "Close",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgb(from var(--background) r g b / 0.7)] backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={handleOverlayClick}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className={`rounded-xl w-full ${maxWidth} shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          border: "1px solid",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ backgroundColor: "var(--elevated)", borderColor: "var(--border)" }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {icon && <span style={{ color: "var(--accent)" }}>{icon}</span>}
            {title}
          </h2>
          <HeaderActions
            actions={headerActions}
            onClose={onClose}
            showCloseButton={showCloseButton}
            closeLabel={closeLabel}
          />
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ backgroundColor: "var(--surface)" }}>
          {children}
        </div>

        {!hideFooter && (
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0"
            style={{ backgroundColor: "var(--elevated)", borderColor: "var(--border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
