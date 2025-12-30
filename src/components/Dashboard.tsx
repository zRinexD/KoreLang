import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookA, Languages, ArrowRight, FileText, Feather, Building2, BarChart3 } from 'lucide-react';
import { LexiconEntry, ViewState, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';
import { Card, StatBox, ActionButton, Section, ViewLayout, StatBadge } from './ui';

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
  projectName,
  author,
  description,
  setView,
  scriptConfig,
  isScriptMode = false
}) => {
  const { t } = useTranslation();

  // Affichage direct sans fallback ni placeholder
  const displayProjectName = projectName;
  const displayAuthor = author;

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

  return (
    <ViewLayout
      icon={Building2}
      title={displayProjectName}
      subtitle={`${t('dashboard.by')} ${displayAuthor}`}
      headerChildren={<StatBadge value={totalWords} label={t('dashboard.lexiconsize')} className="min-w-[140px] shrink-0" />}
    >
      <div className="p-8 mx-auto space-y-8 max-w-7xl">
        {description && (
          <div className="p-4 border rounded-lg" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{description}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ActionButton 
            onClick={() => setView?.('LEXICON')}
            icon={<BookA size={20} />}
            title={t('dashboard.manage_lexicon')}
            description={t('dashboard.manage_lexicon_desc')}
            trailingIcon={<ArrowRight size={18} />}
          />
          <ActionButton 
            onClick={() => setView?.('GRAMMAR')}
            icon={<Languages size={20} />}
            title={t('dashboard.define_grammar')}
            description={t('dashboard.define_grammar_desc')}
            trailingIcon={<ArrowRight size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity - RESTRICTED HEIGHT */}
          <Card className="lg:col-span-2 p-6 flex flex-col max-h-[400px]">
            <Section
              title={t('dashboard.recent_words')}
              icon={<FileText size={16} />}
              className="mb-4"
              right={
                isScriptMode ? (
                  <span className="inline-flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse" style={{ backgroundColor: 'rgb(from var(--primary) r g b / 0.2)', color: 'var(--primary)', borderColor: 'rgb(from var(--primary) r g b / 0.5)', border: '1px solid' }}>
                    <Feather size={12} /> Active
                  </span>
                ) : undefined
              }
            />

            <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
              {recentEntries.length > 0 ? (
                recentEntries.map((entry, idx) => (
                  <div
                    key={`${entry.id}-${idx}`}
                    className="flex items-center justify-between p-3 transition-colors border-b rounded-md last:border-0 group"
                    style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(from var(--surface) r g b / 0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div className="flex items-center gap-4">
                      {isScriptMode ? (
                        <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                          <ConScriptText text={entry.word} scriptConfig={scriptConfig} />
                        </span>
                      ) : (
                        <span className="font-mono text-lg font-bold" style={{ color: 'var(--accent)' }}>{entry.word}</span>
                      )}
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>/{entry.ipa}/</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        {getPosLabel(entry.pos)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border border-dashed rounded-lg" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
                  <BookA size={32} className="mx-auto mb-2 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
                  <p>{t('dashboard.empty_dict')}</p>
                  <button onClick={() => setView?.('LEXICON')} className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-400">{t('dashboard.create_first')}</button>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Chart */}
          <Card className="p-6 flex flex-col h-[400px]">
            <Section title={t('dashboard.pos_dist')} icon={<BarChart3 size={16} />} className="mb-4" />
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
                      contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-dim)', color: 'var(--text-primary)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-secondary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {t('dashboard.no_data')}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ViewLayout>
  );
};

export default Dashboard;