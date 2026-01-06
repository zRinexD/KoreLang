import React, { ReactNode } from "react";
import { ModalBase } from "./ModalBase";
import { DefaultModalFooter } from "./DefaultModalFooter";

interface ModalWithDefaultFooterProps {
  isOpen: boolean;
  onCancel: () => void;
  onValidate: () => void;
  disableCancel?: boolean;
  disableValidate?: boolean;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  closeLabel?: string;
}

export const ModalWithDefaultFooter: React.FC<ModalWithDefaultFooterProps> = ({
  isOpen,
  onCancel,
  onValidate,
  disableCancel = false,
  disableValidate = false,
  title,
  icon,
  children,
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
      footer={
        <DefaultModalFooter
          onCancel={onCancel}
          onValidate={onValidate}
          disableCancel={disableCancel}
          disableValidate={disableValidate}
        />
      }
    >
      {children}
    </ModalBase>
  );
};
