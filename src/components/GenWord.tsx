import React, { useState, useEffect } from 'react';
import { Wand2, Download, Copy, RefreshCw, Trash, ShieldAlert } from 'lucide-react';
import { generateWords } from '../services/geminiService';
import { LexiconEntry, PartOfSpeech, ProjectConstraints, ScriptConfig, PhonologyConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';
import { ViewLayout, CompactButton, Card, FormField, StatBadge } from './ui';

interface GenWordState {
  generated: Array<{ word: string, ipa: string }>;
  constraints: string;
  vibe: string;
  count: number;
}

interface GenWordProps {
  onAddWords: (words: LexiconEntry[]) => void;
  onEditEntry?: (entry: Partial<LexiconEntry>) => void; // NEW Callback
  initialState: GenWordState;
  saveState: (state: GenWordState) => void;
  projectConstraints: ProjectConstraints;
  scriptConfig?: ScriptConfig; // NEW
  isScriptMode?: boolean; // NEW
  phonology?: PhonologyConfig; // NEW
}

const GenWord: React.FC<GenWordProps> = ({ onAddWords, onEditEntry, initialState, saveState, projectConstraints, scriptConfig, isScriptMode = false, phonology }) => {
  const { t } = useTranslation();

  // Use state lifted from parent
  const { generated, constraints, vibe, count } = initialState || { generated: [], constraints: '', vibe: '', count: 5 };

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // NEW: State for error messages

  const loadingMessages = [
    t('genword.loading_1'),
    t('genword.loading_2'),
    t('genword.loading_3')
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let index = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Helper to update specific fields in parent state
  const updateState = (updates: Partial<GenWordState>) => {
    saveState({ ...initialState, ...updates });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      const results = await generateWords(count, constraints, vibe, projectConstraints, phonology);
      // RTE-PERSISTENCE: Merge new results with existing ones
      updateState({ generated: [...generated, ...results] });
    } catch (e: any) {
      console.error("Error generating words in GenWord component:", e);
      setErrorMessage(e.message || "An unknown error occurred during word generation.");
    }
    setLoading(false);
  };

  const handleAdd = (word: string, ipa: string) => {
    // If edit callback exists (Lexicon parent), use it
    if (onEditEntry) {
      onEditEntry({
        word,
        ipa,
        pos: 'Noun',
        definition: ''
      });
    } else {
      // Fallback to auto-add (unlikely path in new UI but safe)
      onAddWords([{
        id: Date.now().toString() + Math.random(),
        word,
        ipa,
        pos: 'Noun',
        definition: 'TODO: Define this word'
      }]);
    }

    // Remove from list after adding
    updateState({ generated: generated.filter(w => w.word !== word) });
  };

  const handleClear = () => {
    updateState({ generated: [] });
  };

  return (
    <ViewLayout icon={Wand2} title={t('genword.title')} subtitle={t('genword.desc')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full p-8 w-full">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="space-y-4">
              <FormField label={t('genword.constraints')}>
                <textarea
                  value={constraints}
                  onChange={(e) => updateState({ constraints: e.target.value })}
                  placeholder={t('genword.constraints_ph')}
                  className="w-full px-2 py-1 rounded text-sm resize-none border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  rows={4}
                />
              </FormField>

              <FormField label={t('genword.vibe')}>
                <input
                  type="text"
                  value={vibe}
                  onChange={(e) => updateState({ vibe: e.target.value })}
                  placeholder={t('genword.vibe_ph')}
                  className="w-full px-2 py-1 rounded text-sm border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </FormField>

              <FormField label={t('genword.count') + ' (Max 15)'}>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => updateState({ count: Math.min(15, Math.max(1, Number(e.target.value))) })}
                  min={1}
                  max={15}
                  className="w-full px-2 py-1 rounded text-sm border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </FormField>

              <CompactButton
                onClick={handleGenerate}
                disabled={loading}
                variant="solid"
                color="var(--accent)"
                icon={loading ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                label={loading ? loadingMessage : t('genword.generate')}
              />
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col overflow-hidden h-full">
            <div className="flex justify-between items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('genword.results')}</h3>
              <div className="flex items-center gap-3">
                <StatBadge value={generated.length} label={t('genword.keep')} />
                {generated.length > 0 && (
                  <CompactButton
                    onClick={handleClear}
                    variant="ghost"
                    icon={<Trash size={14} />}
                    label=""
                  />
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-950/20 border-b border-red-900/50 text-sm flex items-start gap-3" style={{ color: 'var(--text-primary)' }}>
                <ShieldAlert size={16} className="shrink-0" style={{ color: 'var(--accent)' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {generated.length === 0 && !errorMessage ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--elevated)' }}>
                    <Wand2 className="text-slate-500" size={32} />
                  </div>
                  <p>{t('genword.placeholder')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generated.map((item, idx) => (
                    <div key={idx} className="border rounded p-3 flex justify-between items-center group transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                      <div>
                        <div className="text-lg font-bold" style={{ color: isScriptMode ? 'var(--accent)' : 'var(--text-primary)' }}>
                          <ConScriptText text={item.word} scriptConfig={isScriptMode ? scriptConfig : undefined} />
                        </div>
                        <div className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>/{item.ipa}/</div>
                      </div>
                      <button
                        onClick={() => handleAdd(item.word, item.ipa)}
                        className="p-2 rounded transition-colors"
                        style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--elevated)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        title={t('genword.edit_add') || "Edit & Add to Dictionary"}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ViewLayout>
  );
};

export default GenWord;