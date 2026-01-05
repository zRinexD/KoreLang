import React from "react";
import { MoreVertical } from "lucide-react";
import { useTranslation } from "../i18n";

interface SelectPhonemeButtonProps {
  symbol: string;
  name: string;
  onIconClick: () => void;
  hideMoreButton?: boolean;
}

const SelectPhonemeButton: React.FC<SelectPhonemeButtonProps> = ({
  symbol,
  name,
  onIconClick,
  hideMoreButton = false,
}) => {
  const { t } = useTranslation();
  return (
    <div
    className="relative w-24 h-28 flex flex-col items-center justify-center border-4 border-[var(--border)] rounded-lg"
    title={t("common.listen")}
    >
      {!hideMoreButton && (
        <button
          className="absolute top-2 right-1 hover:text-[var(--accent)]"
          onClick={(e) => {
            e.stopPropagation();
            onIconClick();
          }}
        >
          <MoreVertical size={16} />
        </button>
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
