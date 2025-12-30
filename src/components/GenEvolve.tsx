import React, { useState } from 'react';
import { GitBranch, ArrowRight, PlayCircle, Save, Feather } from 'lucide-react';
import { LexiconEntry, SoundChangeRule, ScriptConfig } from '../types';
import { evolveWords } from '../services/geminiService';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';
import { ViewLayout, CompactButton, Card, FormField } from './ui';

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
        <ViewLayout
            icon={GitBranch}
            title={t('genevolve.title')}
            subtitle={t('genevolve.desc')}
            headerChildren={
                <CompactButton
                    onClick={runSimulation}
                    disabled={loading}
                    variant="solid"
                    color="var(--accent)"
                    icon={loading ? <span className="animate-spin">⟳</span> : <PlayCircle size={14} />}
                    label={t('genevolve.run')}
                />
            }
        >

                <div className="h-full w-full flex overflow-hidden">
            {/* Rules Editor */}
            <div className="w-1/3 border-r p-6 overflow-y-auto h-full" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('genevolve.sound_changes')}</h3>
                    <CompactButton
                        onClick={addRule}
                        variant="ghost"
                        icon={<span style={{ fontSize: '14px' }}>+</span>}
                        label=""
                    />
                </div>
                
                <div className="space-y-4">
                    {rules.map((rule, index) => (
                        <Card key={rule.id} className="relative p-4">
                            <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                {index + 1}
                            </div>
                            <div className="space-y-2 mt-2">
                                <FormField label={t('genevolve.rule')}>
                                  <input
                                    type="text"
                                    value={rule.rule}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRule(rule.id, 'rule', e.target.value)}
                                    placeholder={t('genevolve.rule_placeholder')}
                                    className="w-full px-2 py-1 rounded text-sm font-mono border"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--accent)' }}
                                  />
                                </FormField>
                                <FormField label={t('genevolve.description')}>
                                  <input
                                    type="text"
                                    value={rule.description}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRule(rule.id, 'description', e.target.value)}
                                    placeholder={t('genevolve.desc_placeholder')}
                                    className="w-full px-2 py-1 rounded text-sm border"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                  />
                                </FormField>
                            </div>
                            <button 
                                onClick={() => removeRule(rule.id)} 
                                className="absolute top-2 right-2 text-sm transition-colors" 
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                                ×
                            </button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Results Preview */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col h-full" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        {t('genevolve.preview')}
                        {isScriptMode && <Feather size={14} style={{ color: 'var(--accent)' }} />}
                    </h3>
                     {preview.length > 0 && (
                        <CompactButton
                            onClick={applyChanges}
                            variant="solid"
                            color="var(--accent)"
                            icon={<Save size={14} />}
                            label={t('genevolve.commit')}
                        />
                    )}
                </div>

                {preview.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
                            <ArrowRight size={48} className="mx-auto mb-4 opacity-30" />
                            <p>{t('genevolve.placeholder')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {preview.map((entry, idx) => (
                            <Card key={idx} className="p-4 flex items-center gap-4">
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
                            </Card>
                        ))}
                    </div>
                )}
            </div>
                </div>
        </ViewLayout>
  );
};

export default GenEvolve;