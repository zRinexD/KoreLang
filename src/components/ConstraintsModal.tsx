import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle,
  Type,
  Regex,
  ArrowRightToLine,
  ArrowDownAZ,
  Globe,
} from "lucide-react";
import { useTranslation } from "../i18n";
import { useUI } from "../ui/UIContext";
import { useProjectContext } from "../state/ProjectContext";
import { ConScriptText } from "./ConScriptRenderer";
import { POS_SUGGESTIONS } from "../types";
import { ModalBase } from "./ui";

const ConstraintsModal: React.FC = () => {
  const { t } = useTranslation();
  const ui = useUI();
  const { constraints, setConstraints, scriptConfig, setScriptConfig } =
    useProjectContext();

  const [activeTab, setActiveTab] = useState<
    "GENERAL" | "PHONOTACTICS" | "ORTHOGRAPHY" | "SORTING"
  >("GENERAL");
  const [startRuleValue, setStartRuleValue] = useState("");
  const [startRulePos, setStartRulePos] = useState("");
  const [endRuleValue, setEndRuleValue] = useState("");
  const [endRulePos, setEndRulePos] = useState("");

  if (!ui.isOpen("constraints")) return null;

  const getPosLabel = (posKey: string) => t(`pos.${posKey}` as any) || posKey;

  const handleAddBanned = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const val = e.currentTarget.value.trim();
    if (!val || constraints.bannedSequences.includes(val)) return;
    setConstraints({
      ...constraints,
      bannedSequences: [...constraints.bannedSequences, val],
    });
    e.currentTarget.value = "";
  };

  const removeBanned = (seq: string) => {
    setConstraints({
      ...constraints,
      bannedSequences: constraints.bannedSequences.filter((s) => s !== seq),
    });
  };

  const handleAddConditionalRule = (field: "mustStartWith" | "mustEndWith") => {
    const value = field === "mustStartWith" ? startRuleValue : endRuleValue;
    const pos = field === "mustStartWith" ? startRulePos : endRulePos;
    if (!value.trim()) return;
    const newRule = { target: value.trim(), conditionPos: pos || undefined };
    const exists = constraints[field].some(
      (r) =>
        r.target === newRule.target && r.conditionPos === newRule.conditionPos
    );
    if (exists) return;

    setConstraints({
      ...constraints,
      [field]: [...constraints[field], newRule],
    });

    if (field === "mustStartWith") {
      setStartRuleValue("");
      setStartRulePos("");
    } else {
      setEndRuleValue("");
      setEndRulePos("");
    }
  };

  const removeConditionalRule = (
    field: "mustStartWith" | "mustEndWith",
    index: number
  ) => {
    setConstraints({
      ...constraints,
      [field]: constraints[field].filter((_, i) => i !== index),
    });
  };

  const applyPreset = (regex: string) => {
    setConstraints({ ...constraints, allowedGraphemes: regex });
  };

  const renderGlyphPreview = (char: string) => {
    if (!scriptConfig) return null;
    return (
      <span className="ml-2 font-normal" style={{ color: 'var(--accent)' }}>
        (<ConScriptText text={char} scriptConfig={scriptConfig} />)
      </span>
    );
  };

  const renderDirectionButton = (
    dir: "ltr" | "rtl" | "ttb",
    icon: React.ReactNode,
    label: string
  ) => {
    const isSelected = scriptConfig?.direction === dir;
    return (
      <button
        key={dir}
        onClick={() =>
          scriptConfig && setScriptConfig({ ...scriptConfig, direction: dir })
        }
        className={`p-3 rounded border flex flex-col items-center justify-center gap-2 transition-all ${
          isSelected
            ? 'shadow-lg ring-1'
            : ''
        }`}
        style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--text-primary)' } : { backgroundColor: 'var(--surface)', borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.backgroundColor = 'var(--elevated)'; e.currentTarget.style.borderColor = 'var(--accent)'; } }}
        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--text-secondary)'; } }}
      >
        {icon}
        <span className="text-xs font-bold tracking-wider uppercase">
          {label}
        </span>
      </button>
    );
  };

  return (
    <ModalBase
      isOpen={ui.isOpen("constraints")}
      onClose={() => ui.close("constraints")}
      title={t("menu.validation")}
      icon={<ShieldCheck size={20} />}
      maxWidth="max-w-2xl"
    >
        {/* Tabs */}
        <div className="flex px-6 -mx-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--elevated)' }}>
          {[
            { id: "GENERAL", label: t("tab.general"), icon: Type },
            { id: "PHONOTACTICS", label: t("tab.phonotactics"), icon: Regex },
            {
              id: "ORTHOGRAPHY",
              label: t("tab.orthography"),
              icon: ArrowRightToLine,
            },
            { id: "SORTING", label: t("tab.sorting"), icon: ArrowDownAZ },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? ''
                  : ''
              }`}
              style={activeTab === tab.id ? { borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'rgb(from var(--accent) r g b / 0.1)' } : { borderColor: 'transparent', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <tab.icon size={16} />{" "}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-900">
          {activeTab === "GENERAL" && (
            <div className="space-y-6">
              {/* Writing System Settings */}
              <div className="pb-4 space-y-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-blue-400" />
                  <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400">
                    Writing System
                  </h3>
                </div>

                {scriptConfig ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Writing Direction
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {renderDirectionButton(
                        "ltr",
                        <ArrowRightToLine size={24} className="rotate-0" />,
                        "LTR"
                      )}
                      {renderDirectionButton(
                        "rtl",
                        <ArrowRightToLine size={24} className="rotate-180" />,
                        "RTL"
                      )}
                      {renderDirectionButton(
                        "ttb",
                        <ArrowRightToLine size={24} className="rotate-90" />,
                        "Vertical"
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-xs text-red-400 border rounded bg-red-900/20 border-red-900/50">
                    Script Config not loaded.
                  </div>
                )}
              </div>

              {/* Duplicate Check */}
              <div className="flex items-center justify-between p-4 border rounded bg-slate-950 border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    {t("lbl.allow_duplicates")}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t("lbl.allow_duplicates_desc")}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={constraints.allowDuplicates}
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        allowDuplicates: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Case Sensitivity */}
              <div className="flex items-center justify-between p-4 border rounded bg-slate-950 border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    {t("lbl.case_sensitive")}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t("lbl.case_sensitive_desc")}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={constraints.caseSensitive}
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        caseSensitive: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Allowed Graphemes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("lbl.allowed_chars")}
                </label>
                <textarea
                  value={constraints.allowedGraphemes}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      allowedGraphemes: e.target.value,
                    })
                  }
                  className="w-full h-24 p-3 font-mono text-sm border rounded resize-none bg-slate-950 border-slate-700 focus:outline-none"
                  style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                  placeholder="e.g. a-zàáeèéìíòóùúmnñ"
                />
                <p className="text-[10px] text-slate-500">
                  {t("lbl.allowed_chars_desc")}
                </p>

                {/* Presets */}
                <div className="pt-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">
                    {t("sort.presets")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => applyPreset("a-zA-Z")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_latin")}
                    </button>
                    <button
                      onClick={() => applyPreset("a-zA-Zà-žÀ-Ž")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_latin_ext")}
                    </button>
                    <button
                      onClick={() => applyPreset("\\u0400-\\u04FF")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_cyrillic")}
                    </button>
                    <button
                      onClick={() => applyPreset("\\u0370-\\u03FF")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_greek")}
                    </button>
                    <button
                      onClick={() => applyPreset("\\u3040-\\u309F")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_hiragana")}
                    </button>
                    <button
                      onClick={() => applyPreset("\\u30A0-\\u30FF")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_katakana")}
                    </button>
                    <button
                      onClick={() => applyPreset("\\u0600-\\u06FF")}
                      className="px-2 py-1 text-xs border rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    >
                      {t("sort.preset_arabic")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "PHONOTACTICS" && (
            <div className="space-y-6">
              {/* Banned Sequences */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("val.banned_seq")}
                </label>
                <div className="p-4 border rounded bg-slate-950 border-slate-800">
                  <input
                    type="text"
                    placeholder={t("val.banned_placeholder")}
                    onKeyDown={handleAddBanned}
                    className="w-full p-2 mb-3 text-sm text-white border rounded bg-slate-900 border-slate-700 focus:border-red-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    {constraints.bannedSequences.map((seq) => (
                      <div
                        key={seq}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-200 border rounded bg-red-900/30 border-red-800/50"
                      >
                        <span>{seq}</span>
                        {renderGlyphPreview(seq)}
                        <button
                          onClick={() => removeBanned(seq)}
                          className="transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {constraints.bannedSequences.length === 0 && (
                      <span className="text-xs italic text-slate-600">
                        {t("val.no_bans")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Phonotactic Structure */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("lbl.structure")}
                </label>
                <input
                  type="text"
                  value={constraints.phonotacticStructure}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      phonotacticStructure: e.target.value,
                    })
                  }
                  className="w-full p-3 font-mono text-sm border rounded bg-slate-950 border-slate-700 text-amber-400 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. ^(C)(V)(C)$"
                />
                <p className="text-[10px] text-slate-500">
                  {t("lbl.structure_desc")}
                  <br />
                  Example:{" "}
                  <code className="px-1 bg-slate-800 text-slate-300">
                    ^C?VC?$
                  </code>{" "}
                  allows "am", "pam", "pa".
                </p>
              </div>
            </div>
          )}
          {activeTab === "ORTHOGRAPHY" && (
            <div className="space-y-6">
              {/* Must Start With */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("lbl.starts_with")}
                </label>
                <div className="p-4 border rounded bg-slate-950 border-slate-800">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={startRuleValue}
                      onChange={(e) => setStartRuleValue(e.target.value)}
                      placeholder={t("val.target_placeholder")}
                      className="flex-1 p-2 text-sm text-white border rounded bg-slate-900 border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {startRuleValue && renderGlyphPreview(startRuleValue)}
                    <select
                      value={startRulePos}
                      onChange={(e) => setStartRulePos(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none max-w-[120px]"
                    >
                      <option value="">{t("val.any_pos")}</option>
                      {POS_SUGGESTIONS.map((p) => (
                        <option key={p} value={p}>
                          {getPosLabel(p)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAddConditionalRule("mustStartWith")}
                      className="px-3 font-bold rounded"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {constraints.mustStartWith.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-200 border rounded bg-blue-900/30 border-blue-800/50"
                      >
                        <span className="font-mono font-bold">
                          {rule.target}
                        </span>
                        {renderGlyphPreview(rule.target)}
                        {rule.conditionPos && (
                          <span className="text-[10px] bg-slate-800 px-1 rounded ml-1 text-slate-400">
                            {getPosLabel(rule.conditionPos)}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            removeConditionalRule("mustStartWith", idx)
                          }
                          className="ml-1 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {constraints.mustStartWith.length === 0 && (
                      <span className="text-xs italic text-slate-600">
                        {t("val.no_restrictions")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Must End With */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("lbl.ends_with")}
                </label>
                <div className="p-4 border rounded bg-slate-950 border-slate-800">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={endRuleValue}
                      onChange={(e) => setEndRuleValue(e.target.value)}
                      placeholder={t("val.target_placeholder")}
                      className="flex-1 p-2 text-sm text-white border rounded bg-slate-900 border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {endRuleValue && renderGlyphPreview(endRuleValue)}
                    <select
                      value={endRulePos}
                      onChange={(e) => setEndRulePos(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none max-w-[120px]"
                    >
                      <option value="">{t("val.any_pos")}</option>
                      {POS_SUGGESTIONS.map((p) => (
                        <option key={p} value={p}>
                          {getPosLabel(p)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAddConditionalRule("mustEndWith")}
                      className="px-3 font-bold rounded"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {constraints.mustEndWith.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-200 border rounded bg-blue-900/30 border-blue-800/50"
                      >
                        <span className="font-mono font-bold">
                          {rule.target}
                        </span>
                        {renderGlyphPreview(rule.target)}
                        {rule.conditionPos && (
                          <span className="text-[10px] bg-slate-800 px-1 rounded ml-1 text-slate-400">
                            {getPosLabel(rule.conditionPos)}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            removeConditionalRule("mustEndWith", idx)
                          }
                          className="ml-1 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {constraints.mustEndWith.length === 0 && (
                      <span className="text-xs italic text-slate-600">
                        {t("val.no_restrictions")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "SORTING" && (
            <div className="space-y-6">
              {/* Custom Order */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">
                  {t("sort.custom_order")}
                </label>
                <textarea
                  value={constraints.customSortingOrder || ""}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      customSortingOrder: e.target.value,
                    })
                  }
                  className="w-full h-24 p-3 font-mono text-sm text-blue-400 border rounded resize-none bg-slate-950 border-slate-700 focus:border-blue-500 focus:outline-none placeholder-slate-600"
                  placeholder="a b c d e f g..."
                />
                <p className="text-[10px] text-slate-500">
                  {t("sort.custom_order_desc")}
                </p>
              </div>

              {/* Locale Selector */}
              <div className="space-y-2">
                <label className="items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 block-flex">
                  <Globe size={14} /> {t("sort.locale")}
                </label>
                <select
                  value={constraints.sortingLocale || "en"}
                  onChange={(e) =>
                    setConstraints({
                      ...constraints,
                      sortingLocale: e.target.value,
                    })
                  }
                  className="w-full p-2 text-sm border rounded outline-none bg-slate-950 border-slate-700 text-slate-200 focus:border-blue-500"
                >
                  <option value="en">English (Default)</option>
                  <option value="zh-CN">Chinese (Pinyin)</option>
                  <option value="ja">Japanese (Gojūon)</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="sv">Swedish (ÅÄÖ)</option>
                  <option value="tr">Turkish</option>
                </select>
              </div>
            </div>
          )}
        </div>
    </ModalBase>
  );
};

export default ConstraintsModal;