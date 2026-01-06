import React, { useState, useCallback, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CompactButton, ModalWithDefaultFooter } from "./ui";
import { ConfirmDeleteModal } from "./ui/ConfirmDeleteModal";
import { PhonologyConfig } from "../types";
import { AllophonyRule } from "../types/allophony";
import { RuleCard } from "./allophony-editor/RuleCard";
import { AllophonyRuleForm } from "./allophony-editor/AllophonyRuleForm";
import { useAllophony } from "../contexts/AllophonyContext";

interface AllophonyRulesEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
}

export const AllophonyRulesEditor: React.FC<AllophonyRulesEditorProps> = ({
  phonology,
  setData,
}) => {
  const { allophonyRules, updateAllophonyRules } = useAllophony();
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AllophonyRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [formData, setFormData] = useState<AllophonyRule>({
    id: "",
    name: "",
    description: "",
    rule: "",
  });

  // Sync local state with project phonology only when rules actually differ
  useEffect(() => {
    const current = ((phonology as any)?.allophonyRules) || [];
    const sameLength = current.length === allophonyRules.length;
    const sameContent =
      sameLength && current.every((r: AllophonyRule, i: number) => {
        const rr = allophonyRules[i];
        return r.id === rr.id && r.name === rr.name && r.rule === rr.rule && (r.description || "") === (rr.description || "");
      });

    if (!sameContent) {
      setData({ ...phonology, allophonyRules } as any);
    }
  }, [allophonyRules]);

  const handleOpenNew = useCallback(() => {
    setEditingRule(null);
    setFormData({
      id: `rule_${Date.now()}`,
      name: "",
      description: "",
      rule: "",
    });
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((rule: AllophonyRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name || !formData.rule) {
      alert("Name and rule notation are required");
      return;
    }
    if (editingRule) {
      const updatedRules = allophonyRules.map((r) =>
        r.id === editingRule.id ? formData : r
      );
      updateAllophonyRules(updatedRules);
    } else {
      updateAllophonyRules([...allophonyRules, formData]);
    }
    setShowModal(false);
  }, [formData, editingRule, allophonyRules, updateAllophonyRules]);

  const handleDelete = useCallback(
    (id: string) => {
      updateAllophonyRules(allophonyRules.filter((r) => r.id !== id));
      setShowDeleteConfirm(null);
    },
    [allophonyRules, updateAllophonyRules]
  );

  const handleClearRules = useCallback(() => {
    updateAllophonyRules([]);
    setShowClearConfirm(false);
  }, [updateAllophonyRules]);

  return (
    <div className="flex flex-col h-full gap-4 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Allophony Rules
        </h2>
        <div className="flex flex-row gap-2 item-end">
          <CompactButton
            label="Clear rules"
            variant="outline"
            color="var(--error)"
            icon={<Trash2 size={16} />}
            className="hover:bg-[var(--error)] hover:text-white hover:border-[var(--error)]"
            onClick={() => setShowClearConfirm(true)}
          />
          <CompactButton
            label="New Rule"
            variant="solid"
            color="var(--accent)"
            icon={<Plus size={16} />}
            onClick={handleOpenNew}
          />
        </div>
      </div>

      {allophonyRules.length === 0 ? (
        <div
          className="py-8 text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          No allophony rules yet. Create one to define allophonic variations.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allophonyRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={handleOpenEdit}
              onDelete={(id) => setShowDeleteConfirm(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm Modals */}
      <ConfirmDeleteModal
        isOpen={showClearConfirm}
        title="Clear All Rules"
        message="Are you sure you want to clear all allophony rules?"
        onConfirm={handleClearRules}
        onCancel={() => setShowClearConfirm(false)}
        isMultiple={true}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm !== null}
        title="Delete Rule"
        message="Are you sure you want to delete this allophony rule?"
        onConfirm={() =>
          showDeleteConfirm && handleDelete(showDeleteConfirm)
        }
        onCancel={() => setShowDeleteConfirm(null)}
      />

      {/* Edit/Create Modal */}
      <ModalWithDefaultFooter
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onValidate={handleSave}
        disableValidate={!formData.name || !formData.rule}
        title={editingRule ? "Edit Allophony Rule" : "New Allophony Rule"}
        maxWidth="max-w-2xl"
      >
        <AllophonyRuleForm
          formData={formData}
          onChange={setFormData}
          isEditing={!!editingRule}
        />
      </ModalWithDefaultFooter>
    </div>
  );
};

export default AllophonyRulesEditor;
