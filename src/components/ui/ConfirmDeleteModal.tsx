import React from "react";
import { X, Trash2 } from "lucide-react";
import { CompactButton, ModalWithCustomFooter } from "./index";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isMultiple?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isMultiple = false,
}) => (
  <ModalWithCustomFooter
    isOpen={isOpen}
    onCancel={onCancel}
    title={title}
    footer={
      <div className="flex justify-end w-full gap-2">
        <CompactButton
          label="Cancel"
          variant="outline"
          color="var(--text-secondary)"
          icon={<X size={14} />}
          onClick={onCancel}
        />
        <CompactButton
          label={isMultiple ? "Clear" : "Delete"}
          variant="solid"
          color="var(--error)"
          icon={<Trash2 size={14} />}
          onClick={onConfirm}
        />
      </div>
    }
  >
    <div className="p-4">
      <p style={{ color: "var(--text-primary)" }}>{message}</p>
    </div>
  </ModalWithCustomFooter>
);
