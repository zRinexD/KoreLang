import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { CompactButton } from "../ui";
import { AllophonyRule } from "../../types/allophony";

interface RuleCardProps {
  rule: AllophonyRule;
  onEdit: (r: AllophonyRule) => void;
  onDelete: (id: string) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete }) => (
  <div
    className="flex items-start justify-between p-4 border rounded-lg"
    style={{ borderColor: "var(--border)" }}
  >
    <div className="flex-1">
      <div
        className="text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {rule.name}
      </div>
      {rule.description && (
        <div
          className="mt-1 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {rule.description}
        </div>
      )}
      <div
        className="mt-2 font-mono text-sm"
        style={{ color: "var(--text-tertiary)" }}
      >
        {rule.rule}
      </div>
    </div>
    <div className="flex gap-2 ml-4">
      <CompactButton
        title="Edit rule"
        variant="ghost"
        color="var(--accent)"
        icon={<Edit2 size={16} />}
        onClick={() => onEdit(rule)}
      />
      <CompactButton
        title="Delete rule"
        variant="ghost"
        color="var(--error)"
        icon={<Trash2 size={16} />}
        onClick={() => onDelete(rule.id)}
      />
    </div>
  </div>
);
