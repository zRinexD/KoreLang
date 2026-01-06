import React from "react";
import { Check, X } from "lucide-react";
import { CompactButton } from "./CompactButton";
import { useTranslation } from "../../i18n";

interface DefaultModalFooterProps {
  onCancel: () => void;
  onValidate: () => void;
  disableCancel?: boolean;
  disableValidate?: boolean;
}

export const DefaultModalFooter: React.FC<DefaultModalFooterProps> = ({
  onCancel,
  onValidate,
  disableCancel = false,
  disableValidate = false,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <CompactButton
        label={t("common.cancel")}
        variant="outline"
        color="var(--error)"
        icon={<X size={16} />}
        onClick={onCancel}
        disabled={disableCancel}    
      />

      <CompactButton
        label={t("common.validate")}
        variant="solid"
        color="var(--text-secondary)"
        icon={<Check size={16} />}
        onClick={onValidate}
        disabled={disableValidate}
      />
    </>
  );
};
