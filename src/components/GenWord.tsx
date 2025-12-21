import React, { useState, useEffect } from 'react';
import { Wand2, Download, Copy, RefreshCw, Trash, ShieldAlert } from 'lucide-react';
import { generateWords } from '../services/geminiService';
import { LexiconEntry, PartOfSpeech, ProjectConstraints, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

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
}

const GenWord: React.FC<GenWordProps> = ({ onAddWords, onEditEntry, initialState, saveState, projectConstraints, scriptConfig, isScriptMode = false }) => {
  const { t } = useTranslation();

  // Use state lifted from parent
  const { generated, constraints, vibe, count } = initialState;

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
      const results = await generateWords(count, constraints, vibe, projectConstraints);
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
    <div className="h-full flex flex-col p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Wand2 className="text-purple-400" />
          {t('genword.title')}
        </h2>
        <p className="text-slate-400">{t('genword.desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">{t('genword.config')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t('genword.constraints')}</label>
                <textarea
                  value={constraints}
                  onChange={(e) => updateState({ constraints: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none placeholder-slate-600"
                  placeholder={t('genword.constraints_ph')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t('genword.vibe')}</label>
                <input
                  type="text"
                  value={vibe}
                  onChange={(e) => updateState({ vibe: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-600"
                  placeholder={t('genword.vibe_ph')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t('genword.count')} (Max 15)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={count}
                  onChange={(e) => updateState({ count: Math.min(15, Math.max(1, Number(e.target.value))) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Wand2 size={18} />}
                {loading ? loadingMessage : t('genword.generate')}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-200">{t('genword.results')}</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{generated.length} {t('genword.keep')}</span>
              {generated.length > 0 && (
                <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash size={12} /> {t('genword.clear')}
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-950/20 border-b border-red-900/50 text-red-200 text-sm flex items-start gap-3">
              <ShieldAlert size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            {generated.length === 0 && !errorMessage ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                  <Wand2 className="text-slate-500" size={32} />
                </div>
                <p>{t('genword.placeholder')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generated.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded flex justify-between items-center group hover:border-purple-500/50 transition-colors">
                    <div>
                      <div className={`text-lg font-bold ${isScriptMode ? 'text-purple-300' : 'text-slate-200'}`}>
                        <ConScriptText text={item.word} scriptConfig={isScriptMode ? scriptConfig : undefined} />
                      </div>
                      <div className="text-sm text-slate-500 font-mono">/{item.ipa}/</div>
                    </div>
                    <button
                      onClick={() => handleAdd(item.word, item.ipa)}
                      className="p-2 bg-slate-800 hover:bg-green-600 text-slate-400 hover:text-white rounded transition-colors"
                      title={t('genword.edit_add') || "Edit & Add to Dictionary"}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenWord;