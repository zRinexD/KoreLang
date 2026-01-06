import React, { ReactNode } from "react";
import { ModalBase } from "./ModalBase";

interface ModalWithCustomFooterProps {
  isOpen: boolean;
  onCancel: () => void;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  closeLabel?: string;
}

export const ModalWithCustomFooter: React.FC<ModalWithCustomFooterProps> = ({
  isOpen,
  onCancel,
  title,
  icon,
  children,
  footer,
  maxWidth,
  showCloseButton = true,
  headerActions,
  closeLabel,
}) => {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      icon={icon}
      maxWidth={maxWidth}
      showCloseButton={showCloseButton}
      headerActions={headerActions}
      closeLabel={closeLabel}
      footer={footer}
    >
      {children}
    </ModalBase>
  );
};
