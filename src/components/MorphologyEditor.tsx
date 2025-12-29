import React, { useState } from 'react';
import { Plus, Trash2, Table, Tag, Box, ArrowRight, Save, Grid, BookDashed, Filter } from 'lucide-react';
import { MorphologyState, MorphParadigm, MorphDimension, InflectionRule, POS_SUGGESTIONS, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';
import { Card, Section, ViewLayout, CompactButton } from './ui';

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
        <ViewLayout
            icon={Table}
            title={t('morph.title')}
            subtitle={t('morph.subtitle')}
        >
            <div className="flex flex-1 overflow-hidden rounded-xl border m-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Sidebar: Paradigms */}
      <div className="w-64 border-r flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--elevated)' }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
             <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                 <Table size={16} style={{ color: 'var(--accent)' }} /> {t('morph.paradigms')}
             </h3>
             <button onClick={addParadigm} className="transition-colors" style={{ color: 'var(--accent)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent)'}   >
                 <Plus size={18} />
             </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.paradigms.map(p => (
                <div key={p.id} className="flex group">
                    <button
                        onClick={() => setActiveParadigmId(p.id)}
                        className={`flex-1 text-left px-3 py-2 rounded-l text-sm font-medium transition-all ${
                            activeParadigmId === p.id ? 'border-l-2' : ''
                        }`}
                        style={activeParadigmId === p.id ? { backgroundColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)', borderColor: 'var(--accent)' } : { color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { if (activeParadigmId !== p.id) e.currentTarget.style.backgroundColor = 'var(--surface)'; }}
                        onMouseLeave={(e) => { if (activeParadigmId !== p.id) e.currentTarget.style.backgroundColor = ''; }}
                    >
                        {p.name}
                        <div className="text-[10px] uppercase mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{getPosLabel(p.pos)}</div>
                    </button>
                     <button onClick={() => deleteParadigm(p.id)} className="px-2 hover:bg-red-900/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--elevated)' }}>
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--surface)' }}>
          {activeParadigm ? (
              <>
                {/* Paradigm Config Header */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <input 
                                value={activeParadigm.name}
                                onChange={(e) => updateParadigm(activeParadigm.id, { name: e.target.value })}
                                className="bg-transparent text-2xl font-bold border-none focus:ring-0 p-0 w-full placeholder-slate-500"
                                style={{ color: 'var(--text-primary)' }}
                            />
                             <div className="flex items-center gap-2">
                                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('grammar.applies_to')}:</span>
                                <select
                                    value={activeParadigm.pos}
                                    onChange={(e) => updateParadigm(activeParadigm.id, { pos: e.target.value })}
                                    className="rounded px-2 py-1 text-xs outline-none w-auto min-w-[120px]"
                                    style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', border: '1px solid', color: 'var(--text-secondary)' }}
                                >
                                    {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* Root Tester */}
                        <div className="flex flex-col gap-2 items-end">
                            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Sandbox Preview</div>
                            <div className="flex items-center gap-2 p-2 rounded border" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                                <input 
                                    value={testRoot}
                                    onChange={(e) => setTestRoot(e.target.value)}
                                    placeholder={t('morph.root_placeholder')}
                                    className="rounded px-2 py-1 text-sm font-mono w-24 focus:outline-none"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)', border: '1px solid', color: 'var(--accent)' }}
                                />
                                <span style={{ color: 'var(--text-tertiary)' }}>+</span>
                                <select 
                                    value={testPos}
                                    onChange={(e) => setTestPos(e.target.value)}
                                    className="rounded px-2 py-1 text-xs outline-none w-24"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid', color: 'var(--text-secondary)' }}
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
                        <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t('grammar.morph_rules')}</h4>
                        <CompactButton
                            onClick={addRule}
                            variant="solid"
                            color="var(--accent)"
                            icon={<Plus size={14} />}
                            label={t('morphology.add_rule')}
                        />
                    </div>

                    <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                                    <th className="text-left py-3 px-4 text-xs font-bold uppercase w-[25%]" style={{ color: 'var(--text-secondary)' }}>{t('grammar.rule_name')}</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold uppercase w-[20%]" style={{ color: 'var(--text-secondary)' }}>{t('grammar.affix_pattern')}</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold uppercase w-[30%]" style={{ color: 'var(--text-secondary)' }}>Conditions (Logic)</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold uppercase w-[20%]" style={{ color: 'var(--accent)' }}>{t('grammar.preview')}</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
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
                                            : <span style={{ color: 'var(--accent)' }}>{resultStr}</span>
                                        )
                                        : <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{testRoot}</span>;

                                    return (
                                        <tr key={idx} className="hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--elevated)' }}>
                                            <td className="p-3 align-top">
                                                <input 
                                                    value={rule.coordinates.name || ''}
                                                    onChange={(e) => updateRule(idx, 'name', e.target.value)}
                                                    placeholder={t('morph.plural_placeholder')}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder-slate-500"
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </td>
                                            <td className="p-3 align-top">
                                                <input 
                                                    value={rule.affix}
                                                    onChange={(e) => updateRule(idx, 'affix', e.target.value)}
                                                    placeholder={t('morph.affix_placeholder')}
                                                    className="w-full rounded px-2 py-1 text-sm font-mono focus:outline-none"
                                                    style={{ backgroundColor: 'var(--surface)', border: '1px solid', borderColor: 'var(--border)', color: 'var(--accent)' }}
                                                />
                                            </td>
                                            <td className="p-3 align-top">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tag size={12} style={{ color: 'var(--text-tertiary)' }} />
                                                        <select 
                                                            value={rule.logic?.pos || ''}
                                                            onChange={(e) => updateRule(idx, 'logicPos', e.target.value)}
                                                            className="rounded px-1 py-0.5 text-xs w-full outline-none"
                                                            style={{ backgroundColor: 'var(--surface)', border: '1px solid', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                                                        >
                                                            <option value="">Any POS</option>
                                                            {POS_SUGGESTIONS.map(p => <option key={p} value={p}>{getPosLabel(p)}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Filter size={12} style={{ color: 'var(--text-tertiary)' }} />
                                                        <input 
                                                            value={rule.logic?.regex || ''}
                                                            onChange={(e) => updateRule(idx, 'logicRegex', e.target.value)}
                                                            placeholder={t('morph.regex_placeholder')}
                                                            className="rounded px-1 py-0.5 text-xs w-full outline-none font-mono placeholder-slate-500"
                                                            style={{ backgroundColor: 'var(--surface)', border: '1px solid', borderColor: 'var(--border)', color: 'var(--accent)' }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 align-top">
                                                <span className="font-serif">{result}</span>
                                                {!isApplicable && <div className="text-[10px] mt-1" style={{ color: 'var(--error)' }}>Condition Mismatch</div>}
                                            </td>
                                            <td className="p-3 text-right align-top">
                                                <button onClick={() => removeRule(idx)} className="opacity-0 hover:opacity-100 transition-opacity" style={{ color: 'var(--error)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {activeParadigm.rules.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center">
                                            <BookDashed size={24} className="mx-auto mb-2 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
                                            <span style={{ color: 'var(--text-tertiary)' }}>{t('grammar.no_morph_rules')}</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-4 p-3 rounded text-xs flex gap-2 border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: 'var(--accent)' }}>
                        <span className="font-bold">Pro Tip:</span> 
                        Use Regex conditions to create complex morphophonology. E.g., apply a suffix only if the root ends in a vowel (<code>[aeiou]$</code>).
                    </div>
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
                  <Table size={48} className="mb-4 opacity-20" />
                  <p>Select or Create a Paradigm to edit.</p>
              </div>
          )}
      </div>
            </div>
        </ViewLayout>
  );
};

export default MorphologyEditor;