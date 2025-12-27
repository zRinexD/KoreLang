import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, Type, Regex, ArrowRightToLine, ArrowDownAZ, Globe, Plus, Trash2 } from 'lucide-react';
import { ProjectConstraints, POS_SUGGESTIONS, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

interface ConstraintsModalProps {
    isOpen: boolean;
    onClose: () => void;
    constraints: ProjectConstraints;
    onUpdateConstraints: (c: ProjectConstraints) => void;
    scriptConfig?: ScriptConfig; // NEW
    isScriptMode?: boolean; // NEW
    onUpdateScriptConfig?: (c: ScriptConfig) => void;
}

const ConstraintsModal: React.FC<ConstraintsModalProps> = ({ isOpen, onClose, constraints, onUpdateConstraints, scriptConfig, isScriptMode = false, onUpdateScriptConfig }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'PHONOTACTICS' | 'ORTHOGRAPHY' | 'SORTING'>('GENERAL');

    // RTE-UI: Decoupled State to prevent input mirroring bug
    const [startRuleValue, setStartRuleValue] = useState('');
    const [startRulePos, setStartRulePos] = useState<string>('');

    const [endRuleValue, setEndRuleValue] = useState('');
    const [endRulePos, setEndRulePos] = useState<string>('');

    // Helper for POS translation
    const getPosLabel = (posKey: string) => t(`pos.${posKey}` as any) || posKey;

    if (!isOpen) return null;

    // --- Handlers ---
    const handleAddBanned = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = e.currentTarget.value.trim();
            if (val && !constraints.bannedSequences.includes(val)) {
                onUpdateConstraints({
                    ...constraints,
                    bannedSequences: [...constraints.bannedSequences, val]
                });
                e.currentTarget.value = '';
            }
        }
    };

    const removeBanned = (seq: string) => {
        onUpdateConstraints({
            ...constraints,
            bannedSequences: constraints.bannedSequences.filter(s => s !== seq)
        });
    };

    // --- Conditional Rule Handlers ---
    const handleAddConditionalRule = (field: 'mustStartWith' | 'mustEndWith') => {
        // Select correct state based on field
        const value = field === 'mustStartWith' ? startRuleValue : endRuleValue;
        const pos = field === 'mustStartWith' ? startRulePos : endRulePos;

        if (!value.trim()) return;

        const newRule = {
            target: value.trim(),
            conditionPos: pos || undefined
        };

        // Avoid exact dupes
        const exists = constraints[field].some(r => r.target === newRule.target && r.conditionPos === newRule.conditionPos);
        if (!exists) {
            onUpdateConstraints({
                ...constraints,
                [field]: [...constraints[field], newRule]
            });

            // Clear correct state
            if (field === 'mustStartWith') {
                setStartRuleValue('');
                setStartRulePos('');
            } else {
                setEndRuleValue('');
                setEndRulePos('');
            }
        }
    };

    const removeConditionalRule = (field: 'mustStartWith' | 'mustEndWith', index: number) => {
        onUpdateConstraints({
            ...constraints,
            [field]: constraints[field].filter((_, i) => i !== index)
        });
    };

    const applyPreset = (regex: string) => {
        onUpdateConstraints({ ...constraints, allowedGraphemes: regex });
    };

    // Visual helper
    const renderGlyphPreview = (char: string) => {
        if (!isScriptMode || !scriptConfig) return null;
        return (
            <span className="text-purple-400 ml-2 font-normal">
                (<ConScriptText text={char} scriptConfig={scriptConfig} />)
            </span>
        )
    };

    // Helper for Writing Direction UI
    const renderDirectionButton = (dir: 'ltr' | 'rtl' | 'ttb', icon: React.ReactNode, label: string) => {
        const isSelected = scriptConfig?.direction === dir;
        return (
            <button
                key={dir}
                onClick={() => {
                    if (scriptConfig && onUpdateScriptConfig) {
                        onUpdateScriptConfig({ ...scriptConfig, direction: dir });
                    }
                }}
                className={`p-3 rounded border flex flex-col items-center justify-center gap-2 transition-all ${isSelected
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg ring-1 ring-purple-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500'
                    }`}
            >
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            {t('menu.validation')}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">{t('val.desc')}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-900">
                    {[
                        { id: 'GENERAL', label: t('tab.general'), icon: Type },
                        { id: 'PHONOTACTICS', label: t('tab.phonotactics'), icon: Regex },
                        { id: 'ORTHOGRAPHY', label: t('tab.orthography'), icon: ArrowRightToLine },
                        { id: 'SORTING', label: t('tab.sorting'), icon: ArrowDownAZ },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10'
                                : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-900">

                    {activeTab === 'GENERAL' && (
                        <div className="space-y-6">
                            {/* Writing System Settings */}
                            <div className="space-y-4 pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Globe size={18} className="text-blue-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{t('constraints.writing_system')}</h3>
                                </div>

                                {scriptConfig ? (
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase">{t('constraints.writing_direction')}</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {renderDirectionButton('ltr', <ArrowRightToLine size={24} className="rotate-0" />, t('constraints.dir_ltr'))}
                                            {renderDirectionButton('rtl', <ArrowRightToLine size={24} className="rotate-180" />, t('constraints.dir_rtl'))}
                                            {renderDirectionButton('ttb', <ArrowRightToLine size={24} className="rotate-90" />, t('constraints.dir_vertical'))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-red-900/20 text-red-400 text-xs border border-red-900/50 rounded">
                                        {t('constraints.script_config_missing')}
                                    </div>
                                )}
                            </div>

                            {/* Duplicate Check */}
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded border border-slate-800">
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{t('lbl.allow_duplicates')}</div>
                                    <div className="text-xs text-slate-500">{t('lbl.allow_duplicates_desc')}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={constraints.allowDuplicates}
                                        onChange={(e) => onUpdateConstraints({ ...constraints, allowDuplicates: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Case Sensitivity */}
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded border border-slate-800">
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{t('lbl.case_sensitive')}</div>
                                    <div className="text-xs text-slate-500">{t('lbl.case_sensitive_desc')}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={constraints.caseSensitive}
                                        onChange={(e) => onUpdateConstraints({ ...constraints, caseSensitive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Allowed Graphemes */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('lbl.allowed_chars')}</label>
                                <textarea
                                    value={constraints.allowedGraphemes}
                                    onChange={(e) => onUpdateConstraints({ ...constraints, allowedGraphemes: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none h-24 resize-none"
                                    placeholder={t('val.allowed_chars_placeholder')}
                                />
                                <p className="text-[10px] text-slate-500">
                                    {t('lbl.allowed_chars_desc')}
                                </p>

                                {/* Presets */}
                                <div className="pt-2">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">{t('sort.presets')}</div>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => applyPreset('a-zA-Z')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_latin')}</button>
                                        <button onClick={() => applyPreset('a-zA-Zà-žÀ-Ž')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_latin_ext')}</button>
                                        <button onClick={() => applyPreset('\\u0400-\\u04FF')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_cyrillic')}</button>
                                        <button onClick={() => applyPreset('\\u0370-\\u03FF')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_greek')}</button>
                                        <button onClick={() => applyPreset('\\u3040-\\u309F')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_hiragana')}</button>
                                        <button onClick={() => applyPreset('\\u30A0-\\u30FF')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_katakana')}</button>
                                        <button onClick={() => applyPreset('\\u0600-\\u06FF')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700">{t('sort.preset_arabic')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'PHONOTACTICS' && (
                        <div className="space-y-6">
                            {/* Banned Sequences */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('val.banned_seq')}</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-4">
                                    <input
                                        type="text"
                                        placeholder={t('val.banned_placeholder')}
                                        onKeyDown={handleAddBanned}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-red-500 focus:outline-none mb-3"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {constraints.bannedSequences.map(seq => (
                                            <div key={seq} className="flex items-center gap-1 bg-red-900/30 text-red-200 border border-red-800/50 px-2 py-1 rounded text-xs">
                                                <span>{seq}</span>
                                                {renderGlyphPreview(seq)}
                                                <button onClick={() => removeBanned(seq)} className="hover:text-white"><X size={12} /></button>
                                            </div>
                                        ))}
                                        {constraints.bannedSequences.length === 0 && <span className="text-xs text-slate-600 italic">{t('val.no_bans')}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Phonotactic Structure */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('lbl.structure')}</label>
                                <input
                                    type="text"
                                    value={constraints.phonotacticStructure}
                                    onChange={(e) => onUpdateConstraints({ ...constraints, phonotacticStructure: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm font-mono text-amber-400 focus:border-amber-500 focus:outline-none"
                                    placeholder={t('val.structure_placeholder')}
                                />
                                <p className="text-[10px] text-slate-500">
                                    {t('lbl.structure_desc')}
                                    <br />Example: <code className="bg-slate-800 px-1 text-slate-300">^C?VC?$</code> allows "am", "pam", "pa".
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ORTHOGRAPHY' && (
                        <div className="space-y-6">

                            {/* Must Start With */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('lbl.starts_with')}</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-4">
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={startRuleValue}
                                            onChange={(e) => setStartRuleValue(e.target.value)}
                                            placeholder={t('val.target_placeholder')}
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                        {/* LIVE PREVIEW IN INPUT */}
                                        {startRuleValue && renderGlyphPreview(startRuleValue)}

                                        <select
                                            value={startRulePos}
                                            onChange={(e) => setStartRulePos(e.target.value)}
                                            className="bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none max-w-[120px]"
                                        >
                                            <option value="">{t('val.any_pos')}</option>
                                            {/* POS TRANSLATION */}
                                            {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleAddConditionalRule('mustStartWith')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {constraints.mustStartWith.map((rule, idx) => (
                                            <div key={idx} className="flex items-center gap-1 bg-blue-900/30 text-blue-200 border border-blue-800/50 px-2 py-1 rounded text-xs">
                                                <span className="font-mono font-bold">{rule.target}</span>
                                                {renderGlyphPreview(rule.target)}
                                                {rule.conditionPos && <span className="text-[10px] bg-slate-800 px-1 rounded ml-1 text-slate-400">{getPosLabel(rule.conditionPos)}</span>}
                                                <button onClick={() => removeConditionalRule('mustStartWith', idx)} className="hover:text-white ml-1"><X size={12} /></button>
                                            </div>
                                        ))}
                                        {constraints.mustStartWith.length === 0 && <span className="text-xs text-slate-600 italic">{t('val.no_restrictions')}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Must End With */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('lbl.ends_with')}</label>
                                <div className="bg-slate-950 border border-slate-800 rounded p-4">
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={endRuleValue}
                                            onChange={(e) => setEndRuleValue(e.target.value)}
                                            placeholder={t('val.target_placeholder')}
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                        {endRuleValue && renderGlyphPreview(endRuleValue)}
                                        <select
                                            value={endRulePos}
                                            onChange={(e) => setEndRulePos(e.target.value)}
                                            className="bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none max-w-[120px]"
                                        >
                                            <option value="">{t('val.any_pos')}</option>
                                            {/* POS TRANSLATION */}
                                            {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleAddConditionalRule('mustEndWith')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {constraints.mustEndWith.map((rule, idx) => (
                                            <div key={idx} className="flex items-center gap-1 bg-blue-900/30 text-blue-200 border border-blue-800/50 px-2 py-1 rounded text-xs">
                                                <span className="font-mono font-bold">{rule.target}</span>
                                                {renderGlyphPreview(rule.target)}
                                                {rule.conditionPos && <span className="text-[10px] bg-slate-800 px-1 rounded ml-1 text-slate-400">{getPosLabel(rule.conditionPos)}</span>}
                                                <button onClick={() => removeConditionalRule('mustEndWith', idx)} className="hover:text-white ml-1"><X size={12} /></button>
                                            </div>
                                        ))}
                                        {constraints.mustEndWith.length === 0 && <span className="text-xs text-slate-600 italic">{t('val.no_restrictions')}</span>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === 'SORTING' && (
                        <div className="space-y-6">
                            {/* Custom Order */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('sort.custom_order')}</label>
                                <textarea
                                    value={constraints.customSortingOrder || ''}
                                    onChange={(e) => onUpdateConstraints({ ...constraints, customSortingOrder: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm font-mono text-blue-400 focus:border-blue-500 focus:outline-none h-24 resize-none placeholder-slate-600"
                                    placeholder={t('val.custom_sort_placeholder')}
                                />
                                <p className="text-[10px] text-slate-500">{t('sort.custom_order_desc')}</p>
                            </div>

                            {/* Locale Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                                    <Globe size={14} /> {t('sort.locale')}
                                </label>
                                <select
                                    value={constraints.sortingLocale || 'en'}
                                    onChange={(e) => onUpdateConstraints({ ...constraints, sortingLocale: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
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

                <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <CheckCircle size={16} />
                        {t('settings.done')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConstraintsModal;