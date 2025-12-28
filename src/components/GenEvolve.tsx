import React, { useState } from 'react';
import { GitBranch, ArrowRight, PlayCircle, Save, Feather } from 'lucide-react';
import { LexiconEntry, SoundChangeRule, ScriptConfig } from '../types';
import { evolveWords } from '../services/geminiService';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

interface GenEvolveProps {
  entries: LexiconEntry[];
  onUpdateEntries: (newEntries: LexiconEntry[]) => void;
  rules: SoundChangeRule[];
  setRules: React.Dispatch<React.SetStateAction<SoundChangeRule[]>>;
  scriptConfig?: ScriptConfig; // NEW
  isScriptMode?: boolean; // NEW
}

const GenEvolve: React.FC<GenEvolveProps> = ({ entries, onUpdateEntries, rules, setRules, scriptConfig, isScriptMode = false }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<LexiconEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const addRule = () => {
    setRules([...rules, { id: Date.now().toString(), rule: '', description: '' }]);
  };

  const updateRule = (id: string, field: keyof SoundChangeRule, value: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const runSimulation = async () => {
    setLoading(true);
    // Only send a subset to avoid token limits in this demo
    const sampleSize = entries.slice(0, 20); 
    const results = await evolveWords(sampleSize, rules);
    setPreview(results);
    setLoading(false);
  };

  const applyChanges = () => {
      // In a real app, this would merge the preview into the main state
      alert(t('genevolve.commit_alert'));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <GitBranch style={{ color: 'var(--accent)' }} />
                    {t('genevolve.title')}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('genevolve.desc')}</p>
             </div>
             <button
                onClick={runSimulation}
                disabled={loading}
                className="px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
             >
                {loading ? <span className="animate-spin">⟳</span> : <PlayCircle />}
                {t('genevolve.run')}
             </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Rules Editor */}
            <div className="w-1/3 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('genevolve.sound_changes')}</h3>
                    <button onClick={addRule} className="text-sm" style={{ color: 'var(--accent)' }}>+ {t('genevolve.add_rule')}</button>
                </div>
                
                <div className="space-y-4">
                    {rules.map((rule, index) => (
                        <div key={rule.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 relative group">
                            <div className="absolute -left-2 -top-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold border border-slate-900" style={{ color: 'var(--text-primary)' }}>
                                {index + 1}
                            </div>
                            <div className="space-y-2">
                                <input 
                                    value={rule.rule}
                                    onChange={(e) => updateRule(rule.id, 'rule', e.target.value)}
                                    placeholder={t('genevolve.rule_placeholder')}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-sm"
                                    style={{ color: 'var(--accent)' }}
                                />
                                <input 
                                    value={rule.description}
                                    onChange={(e) => updateRule(rule.id, 'description', e.target.value)}
                                    placeholder={t('genevolve.desc_placeholder')}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                            </div>
                            <button onClick={() => removeRule(rule.id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Preview */}
            <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        {t('genevolve.preview')}
                        {isScriptMode && <Feather size={14} style={{ color: 'var(--accent)' }} />}
                    </h3>
                     {preview.length > 0 && (
                        <button onClick={applyChanges} className="text-sm px-3 py-1 rounded flex items-center gap-2 transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}>
                            <Save size={14} /> {t('genevolve.commit')}
                        </button>
                    )}
                </div>

                {preview.length === 0 ? (
                    <div className="text-center text-slate-600 mt-20">
                        <ArrowRight size={48} className="mx-auto mb-4 opacity-30" />
                        <p>{t('genevolve.placeholder')}</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {preview.map((entry, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                                <div className="w-1/3 text-right">
                                    <div className="line-through text-sm" style={{ color: 'var(--text-secondary)' }}>{entries.find(e => e.id === entry.id)?.word || entry.word}</div>
                                    <div className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>/{entries.find(e => e.id === entry.id)?.ipa || entry.ipa}/</div>
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}><ArrowRight size={20} /></div>
                                <div className="flex-1">
                                    <div className="text-xl font-bold" style={{ color: isScriptMode ? 'var(--accent)' : 'var(--text-primary)' }}>
                                        <ConScriptText text={entry.word} scriptConfig={scriptConfig} />
                                    </div>
                                    <div className="font-mono text-sm" style={{ color: 'var(--accent)', opacity: 0.7 }}>/{entry.ipa}/</div>
                                    <div className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>{entry.etymology}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default GenEvolve;