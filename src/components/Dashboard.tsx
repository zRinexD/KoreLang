import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookA, Languages, ArrowRight, FileText, Feather } from 'lucide-react';
import { LexiconEntry, ViewState, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

interface DashboardProps {
  entries: LexiconEntry[];
  projectName?: string;
  author?: string;
  description?: string;
  setView?: (view: ViewState) => void;
  scriptConfig?: ScriptConfig;
  isScriptMode?: boolean; // NEW PROP
}

const COLORS = ['#007acc', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard: React.FC<DashboardProps> = ({
  entries,
  projectName = "Untitled Project",
  author = "Unknown Author",
  description,
  setView,
  scriptConfig,
  isScriptMode = false
}) => {
  const { t } = useTranslation();

  const displayProjectName = projectName === "Untitled Project" ? t('dashboard.default_project') : (projectName || t('dashboard.default_project'));
  const displayAuthor = author === "Unknown Author" ? t('dashboard.default_author') : (author || t('dashboard.default_author'));

  // Helper for POS translation
  const getPosLabel = (posKey: string) => {
    return t(`pos.${posKey}` as any) || posKey;
  }

  // Calculate Stats with TRANSLATED keys
  const posCounts = entries.reduce((acc, entry) => {
    acc[entry.pos] = (acc[entry.pos] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const posData = Object.keys(posCounts).map(key => ({
    name: getPosLabel(key), // TRANSLATED
    value: posCounts[key]
  }));

  const totalWords = entries.length;
  // LIMIT TO 8 ENTRIES to prevent dashboard saturation
  const recentEntries = [...entries].reverse().slice(0, 8);

  const hasScript = scriptConfig && scriptConfig.glyphs.length > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto">
      <div className="flex justify-between items-start border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">{displayProjectName}</h2>
          <p className="text-slate-400 text-sm mt-1">{t('dashboard.by')} <span className="text-blue-400 font-medium">{displayAuthor}</span></p>
          {description && <p className="text-slate-500 text-sm mt-2 max-w-2xl">{description}</p>}
        </div>
        <div className="text-right bg-slate-800 p-4 rounded-lg border border-slate-700 min-w-[150px]">
          <div className="text-3xl font-bold text-slate-50 text-center">{totalWords}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold text-center mt-1">{t('dashboard.lexiconsize')}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setView?.('LEXICON')}
          className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:bg-slate-750 hover:border-blue-500 transition-all group text-left shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-blue-900/20 rounded-md">
              <BookA className="text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <ArrowRight size={18} className="text-slate-600 group-hover:text-blue-400" />
          </div>
          <div className="font-bold text-slate-200 text-lg">{t('dashboard.manage_lexicon')}</div>
          <p className="text-sm text-slate-400 mt-1">{t('dashboard.manage_lexicon_desc')}</p>
        </button>

        <button
          onClick={() => setView?.('GRAMMAR')}
          className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:bg-slate-750 hover:border-emerald-500 transition-all group text-left shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-emerald-900/20 rounded-md">
              <Languages className="text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <ArrowRight size={18} className="text-slate-600 group-hover:text-emerald-400" />
          </div>
          <div className="font-bold text-slate-200 text-lg">{t('dashboard.define_grammar')}</div>
          <p className="text-sm text-slate-400 mt-1">{t('dashboard.define_grammar_desc')}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity - RESTRICTED HEIGHT */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex flex-col max-h-[400px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} />
              {t('dashboard.recent_words')}
            </h3>

            {isScriptMode && hasScript && (
              <span className="flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-900/30 text-purple-300 border border-purple-800 animate-pulse">
                <Feather size={12} /> Active
              </span>
            )}
          </div>

          <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry, idx) => (
                <div key={`${entry.id}-${idx}`} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-md transition-colors border-b border-slate-700/50 last:border-0 group">
                  <div className="flex items-center gap-4">
                    {isScriptMode && hasScript ? (
                      <span className="text-purple-300 font-bold text-xl">
                        <ConScriptText text={entry.word} scriptConfig={scriptConfig} />
                      </span>
                    ) : (
                      <span className="font-mono text-blue-400 font-bold text-lg">{entry.word}</span>
                    )}
                    <span className="text-slate-500 text-sm group-hover:text-slate-400">/{entry.ipa}/</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">
                      {getPosLabel(entry.pos)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                <BookA size={32} className="mx-auto mb-2 opacity-50" />
                <p>{t('dashboard.empty_dict')}</p>
                <button onClick={() => setView?.('LEXICON')} className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-medium">{t('dashboard.create_first')}</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Chart */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('dashboard.pos_dist')}</h3>
          <div className="flex-1 min-h-[250px]">
            {totalWords > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={posData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {posData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-dim)', color: 'var(--text-1)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-2)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm">
                {t('dashboard.no_data')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;