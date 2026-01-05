import React, { useState, useRef } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { useTranslation } from "../i18n";
import { ContextMenu, ContextMenuItem } from "./ui";

interface SelectPhonemeButtonProps {
  symbol: string;
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
  hideMoreButton?: boolean;
}

const SelectPhonemeButton: React.FC<SelectPhonemeButtonProps> = ({
  symbol,
  name,
  onEdit,
  onDelete,
  hideMoreButton = false,
}) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuItems: ContextMenuItem[] = [
    {
      label: t("common.edit") || "Edit",
      icon: <Edit size={14} />,
      onClick: () => onEdit?.(),
      disabled: !onEdit,
    },
    {
      label: t("common.delete") || "Delete",
      icon: <Trash size={14} />,
      onClick: () => onDelete?.(),
      variant: "danger" as const,
      disabled: !onDelete,
    },
  ];

  return (
    <div
    className="relative w-24 h-28 flex flex-col items-center justify-center border-4 border-[var(--border)] rounded-lg"
    title={t("common.listen")}
    >
      {!hideMoreButton && (
        <>
          <button
            ref={buttonRef}
            className="absolute top-2 right-1 hover:text-[var(--accent)]"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreVertical size={16} />
          </button>
          <ContextMenu
            items={menuItems}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchorEl={buttonRef.current}
          />
        </>
      )}

      <div className="font-serif text-xl font-bold ">{symbol}</div>
      
      <div
        className="text-[8px] uppercase text-center font-normal p-1 mt-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        {name}
      </div>
    </div>
  );
};

export default SelectPhonemeButton;
