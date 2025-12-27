import React, { useState } from 'react';
import { Plus, Trash2, Table, Tag, Box, ArrowRight, Save, Grid, BookDashed, Filter } from 'lucide-react';
import { MorphologyState, MorphParadigm, MorphDimension, InflectionRule, POS_SUGGESTIONS, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

interface MorphologyEditorProps {
  data: MorphologyState;
  setData: (data: MorphologyState) => void;
  scriptConfig?: ScriptConfig; // NEW
  isScriptMode?: boolean; // NEW
}

const MorphologyEditor: React.FC<MorphologyEditorProps> = ({ data, setData, scriptConfig, isScriptMode = false }) => {
  const { t } = useTranslation();
  const [activeParadigmId, setActiveParadigmId] = useState<string | null>(null);
  const [testRoot, setTestRoot] = useState('am');
  const [testPos, setTestPos] = useState<string>('Verb'); // For simulating logic checks

  // Helper for POS translation
  const getPosLabel = (posKey: string) => t(`pos.${posKey}` as any) || posKey;

  // --- Paradigm Management ---
  const addParadigm = () => {
    const newParadigm: MorphParadigm = {
      id: Date.now().toString(),
      name: 'New Paradigm',
      pos: 'Noun',
      dimensions: [], 
      rules: [] 
    };
    setData({ ...data, paradigms: [...data.paradigms, newParadigm] });
    setActiveParadigmId(newParadigm.id);
  };

  const activeParadigm = data.paradigms.find(p => p.id === activeParadigmId);

  const updateParadigm = (id: string, updates: Partial<MorphParadigm>) => {
    setData({
      ...data,
      paradigms: data.paradigms.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const deleteParadigm = (id: string) => {
    if(confirm(t('common.confirm'))) {
        setData({
            ...data,
            paradigms: data.paradigms.filter(p => p.id !== id)
        });
        if(activeParadigmId === id) setActiveParadigmId(null);
    }
  }

  // --- Rule Management ---
  
  const addRule = () => {
      if (!activeParadigm) return;
      const newRule: InflectionRule = {
          coordinates: { name: t('morph.new_rule') }, 
          affix: "-",
          isPrefix: false,
          logic: {} // Empty logic by default
      };
      updateParadigm(activeParadigm.id, { rules: [...activeParadigm.rules, newRule] });
  };

  const updateRule = (index: number, field: string, value: string) => {
      if (!activeParadigm) return;
      const newRules = [...activeParadigm.rules];
      const rule = newRules[index];
      
      if (field === 'name') {
          rule.coordinates = { ...rule.coordinates, name: value };
      } else if (field === 'affix') {
          rule.affix = value;
          rule.isPrefix = value.trim().endsWith('-');
      } else if (field === 'logicPos') {
          rule.logic = { ...rule.logic, pos: value || undefined };
      } else if (field === 'logicRegex') {
          rule.logic = { ...rule.logic, regex: value || undefined };
      }
      
      updateParadigm(activeParadigm.id, { rules: newRules });
  };

  const removeRule = (index: number) => {
      if (!activeParadigm) return;
      const newRules = activeParadigm.rules.filter((_, i) => i !== index);
      updateParadigm(activeParadigm.id, { rules: newRules });
  };

  const checkRuleApplicable = (rule: InflectionRule) => {
      // 1. POS Check
      if (rule.logic?.pos && rule.logic.pos !== testPos) return false;
      
      // 2. Regex Check
      if (rule.logic?.regex) {
          try {
              const re = new RegExp(rule.logic.regex);
              if (!re.test(testRoot)) return false;
          } catch (e) {
              return false; // Invalid Regex
          }
      }
      return true;
  };

  return (
    <div className="flex h-full bg-slate-900 overflow-hidden rounded-xl border border-slate-800">
      {/* Sidebar: Paradigms */}
      <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
             <h3 className="font-bold text-slate-200 flex items-center gap-2">
                 <Table size={16} className="text-blue-500" /> {t('morph.paradigms')}
             </h3>
             <button onClick={addParadigm} className="text-blue-500 hover:text-white transition-colors">
                 <Plus size={18} />
             </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.paradigms.map(p => (
                <div key={p.id} className="flex group">
                    <button
                        onClick={() => setActiveParadigmId(p.id)}
                        className={`flex-1 text-left px-3 py-2 rounded-l text-sm font-medium transition-all ${
                            activeParadigmId === p.id ? 'bg-blue-900/30 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:bg-slate-900'
                        }`}
                    >
                        {p.name}
                        <div className="text-[10px] text-slate-600 uppercase mt-0.5">{getPosLabel(p.pos)}</div>
                    </button>
                     <button onClick={() => deleteParadigm(p.id)} className="px-2 bg-slate-900 hover:bg-red-900/30 hover:text-red-400 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col bg-slate-900">
          {activeParadigm ? (
              <>
                {/* Paradigm Config Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <input 
                                value={activeParadigm.name}
                                onChange={(e) => updateParadigm(activeParadigm.id, { name: e.target.value })}
                                className="bg-transparent text-2xl font-bold text-white border-none focus:ring-0 p-0 placeholder-slate-600 w-full"
                            />
                             <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-sm">{t('grammar.applies_to')}:</span>
                                <select
                                    value={activeParadigm.pos}
                                    onChange={(e) => updateParadigm(activeParadigm.id, { pos: e.target.value })}
                                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none w-auto min-w-[120px]"
                                >
                                    {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* Root Tester */}
                        <div className="flex flex-col gap-2 items-end">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sandbox Preview</div>
                            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                                <input 
                                    value={testRoot}
                                    onChange={(e) => setTestRoot(e.target.value)}
                                    placeholder={t('morph.root_placeholder')}
                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-amber-400 font-mono w-24 focus:outline-none focus:border-amber-500"
                                />
                                <span className="text-slate-600">+</span>
                                <select 
                                    value={testPos}
                                    onChange={(e) => setTestPos(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none w-24"
                                >
                                    {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simplified Rules List */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('grammar.morph_rules')}</h4>
                        <button onClick={addRule} className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors">
                            <Plus size={12} /> {t('grammar.add_rule')}
                        </button>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase w-[25%]">{t('grammar.rule_name')}</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase w-[20%]">{t('grammar.affix_pattern')}</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase w-[30%]">Conditions (Logic)</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-emerald-500 uppercase w-[20%]">{t('grammar.preview')}</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {activeParadigm.rules.map((rule, idx) => {
                                    // Calculate Preview
                                    const cleanAffix = rule.affix.replace('-', '');
                                    const isPrefix = rule.affix.endsWith('-');
                                    const isApplicable = checkRuleApplicable(rule);
                                    
                                    const resultStr = isPrefix ? `${cleanAffix}${testRoot}` : `${testRoot}${cleanAffix}`;
                                    
                                    const result = isApplicable 
                                        ? (
                                            isScriptMode 
                                            ? <ConScriptText text={resultStr} scriptConfig={scriptConfig} className="text-lg text-purple-300" />
                                            : <span className="text-emerald-400">{resultStr}</span>
                                        )
                                        : <span className="text-slate-600 italic line-through decoration-slate-700 decoration-2">{testRoot}</span>;

                                    return (
                                        <tr key={idx} className="group hover:bg-slate-900 transition-colors">
                                            <td className="p-3 align-top">
                                                <input 
                                                    value={rule.coordinates.name || ''}
                                                    onChange={(e) => updateRule(idx, 'name', e.target.value)}
                                                    placeholder={t('morph.plural_placeholder')}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 text-sm font-medium placeholder-slate-600"
                                                />
                                            </td>
                                            <td className="p-3 align-top">
                                                <input 
                                                    value={rule.affix}
                                                    onChange={(e) => updateRule(idx, 'affix', e.target.value)}
                                                    placeholder={t('morph.affix_placeholder')}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono text-sm focus:border-amber-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="p-3 align-top">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tag size={12} className="text-slate-500" />
                                                        <select 
                                                            value={rule.logic?.pos || ''}
                                                            onChange={(e) => updateRule(idx, 'logicPos', e.target.value)}
                                                            className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300 w-full outline-none"
                                                        >
                                                            <option value="">Any POS</option>
                                                            {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Filter size={12} className="text-slate-500" />
                                                        <input 
                                                            value={rule.logic?.regex || ''}
                                                            onChange={(e) => updateRule(idx, 'logicRegex', e.target.value)}
                                                            placeholder={t('morph.regex_placeholder')}
                                                            className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-blue-300 w-full outline-none font-mono placeholder-slate-600"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 align-top">
                                                <span className="font-serif">{result}</span>
                                                {!isApplicable && <div className="text-[10px] text-red-400 mt-1">Condition Mismatch</div>}
                                            </td>
                                            <td className="p-3 text-right align-top">
                                                <button onClick={() => removeRule(idx)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {activeParadigm.rules.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-600">
                                            <BookDashed size={24} className="mx-auto mb-2 opacity-50" />
                                            {t('grammar.no_morph_rules')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-900/10 border border-blue-900/30 rounded text-xs text-blue-300 flex gap-2">
                        <span className="font-bold">Pro Tip:</span> 
                        Use Regex conditions to create complex morphophonology. E.g., apply a suffix only if the root ends in a vowel (<code>[aeiou]$</code>).
                    </div>
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <Table size={48} className="mb-4 opacity-20" />
                  <p>Select or Create a Paradigm to edit.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default MorphologyEditor;