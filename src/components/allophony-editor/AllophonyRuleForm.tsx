import React from "react";
import { FormField } from "../ui";
import { AllophonyRule } from "../../types/allophony";

interface AllophonyRuleFormProps {
  formData: AllophonyRule;
  onChange: (data: AllophonyRule) => void;
  isEditing?: boolean;
}

export const AllophonyRuleForm: React.FC<AllophonyRuleFormProps> = ({
  formData,
  onChange,
  isEditing,
}) => (
  <div className="flex flex-col gap-4 p-4">
    <FormField label="Rule Name">
      <input
        type="text"
        value={formData.name}
        onChange={(e) =>
          onChange({ ...formData, name: e.target.value })
        }
        className="w-full px-3 py-2 text-sm bg-transparent border rounded outline-none focus:ring-1"
        placeholder="e.g., 'Vowel Reduction'"
      />
    </FormField>

    <FormField label="Description">
      <textarea
        value={formData.description}
        onChange={(e) =>
          onChange({ ...formData, description: e.target.value })
        }
        className="w-full px-3 py-2 text-sm bg-transparent border rounded outline-none resize-none focus:ring-1"
        rows={2}
        placeholder="Describe the rule..."
      />
    </FormField>

    <FormField label="Rule Notation">
      <textarea
        value={formData.rule}
        onChange={(e) =>
          onChange({ ...formData, rule: e.target.value })
        }
        className="w-full px-3 py-2 font-mono text-sm bg-transparent border rounded outline-none resize-none focus:ring-1"
        rows={4}
        placeholder="X → Y / A_B&#10;&#10;Example:&#10;[-stop, +alveolar, +continuant] / [+vowel]_[+vowel, -stress]"
      />
      <div
        className="mt-2 space-y-1 text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        <p>
          <strong>Syntax:</strong> X → Y / A_B
        </p>
        <p>
          <strong>X:</strong> Input features (e.g., [+consonantal,
          -voice])
        </p>
        <p>
          <strong>Y:</strong> Output features (e.g., [+voice])
        </p>
        <p>
          <strong>A_B:</strong> Context (A = before, B = after, _ =
          position)
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul className="ml-4 list-disc">
          <li>/t/ → [ɾ] / [+vowel]_[+vowel, -stress]</li>
          <li>[+nasal] → [+syllabic] / _#</li>
          <li>[+stop] → ∅ / V_V</li>
        </ul>
      </div>
    </FormField>
  </div>
);
