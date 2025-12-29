import React, { useState } from 'react';
import { Languages, Play, CheckCircle, Table, Code, Bug, Lightbulb, Box, Link } from 'lucide-react';
import { analyzeSyntax } from '../services/geminiService';
import MorphologyEditor from './MorphologyEditor';
import CodeEditor from './CodeEditor';
import { MorphologyState, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { Card, Section, ViewLayout, CompactButton, ToggleButton } from './ui';

interface GrammarEditorProps {
    grammar: string;
    setGrammar: (grammar: string) => void;
    morphology: MorphologyState;
    setMorphology: (morph: MorphologyState) => void;
    showLineNumbers?: boolean; // NEW PROP
    scriptConfig?: ScriptConfig; // NEW
    isScriptMode?: boolean; // NEW
}

const GrammarEditor: React.FC<GrammarEditorProps> = ({ grammar, setGrammar, morphology, setMorphology, showLineNumbers, scriptConfig, isScriptMode }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'SYNTAX' | 'MORPHOLOGY'>('SYNTAX');
    const [testSentence, setTestSentence] = useState(t('grammar.test_sentence'));
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        // Pass morphology to the analysis service so AI can use the rules defined in the other tab
        const result = await analyzeSyntax(testSentence, grammar, morphology);
        setOutput(result);
        setLoading(false);
    }

    // Calculate stats for the context panel
    const totalParadigms = morphology.paradigms.length;
    const totalRules = morphology.paradigms.reduce((acc, p) => acc + p.rules.length, 0);

    return (
        <ViewLayout
            icon={Languages}
            title={t('grammar.title')}
            subtitle={t('grammar.desc')}
            headerChildren={
                <div className="flex bg-neutral-900 border border-neutral-800 rounded gap-0 h-[32px]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <ToggleButton
                        isActive={activeTab === 'SYNTAX'}
                        onClick={() => setActiveTab('SYNTAX')}
                        icon={<Code size={14} />}
                        label={t('grammar.tab.syntax')}
                        position="first"
                    />
                    <ToggleButton
                        isActive={activeTab === 'MORPHOLOGY'}
                        onClick={() => setActiveTab('MORPHOLOGY')}
                        icon={<Table size={14} />}
                        label={t('grammar.tab.morphology')}
                        position="last"
                    />
                </div>
            }
        >

            <div className="p-6 max-w-7xl mx-auto w-full flex-1 overflow-hidden flex flex-col gap-6">
            {activeTab === 'SYNTAX' ? (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden animate-in fade-in duration-300">
                    {/* BNF Editor Panel */}
                    <Card className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>{t('grammar.bnfc')}</span>
                            </div>
                            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}><CheckCircle size={10} /> {t('grammar.saved')}</span>
                        </div>

                        {/* PROFESSIONAL EDITOR IMPLEMENTATION */}
                        <div className="flex-1 p-0 overflow-hidden relative">
                            <CodeEditor
                                value={grammar}
                                onChange={setGrammar}
                                showLineNumbers={showLineNumbers}
                                placeholder={t('grammar.bnf_placeholder')}
                            />
                        </div>
                    </Card>

                    {/* Test Console */}
                    <div className="w-full lg:w-96 flex flex-col gap-4">

                        {/* VISUAL VALIDATION OF MORPHOLOGY CONNECTION */}
                        <Card className="p-3 flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)' }}>
                                <Box size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t('grammar.morph_context')}</div>
                                <div className="text-[10px] flex gap-2 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                                    <span>{t('grammar.paradigms', { count: totalParadigms })}</span>
                                    <span>•</span>
                                    <span>{t('grammar.rules_loaded', { count: totalRules })}</span>
                                </div>
                            </div>
                            {totalRules > 0 ? (
                                <div className="text-xs font-bold px-2 py-1 rounded border flex items-center gap-1" style={{ color: 'var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)', borderColor: 'var(--accent)' }}>
                                    <Link size={10} /> {t('grammar.linked')}
                                </div>
                            ) : (
                                <div className="text-xs font-bold px-2 py-1 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t('grammar.no_rules')}</div>
                            )}
                        </Card>

                        <Card className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                    <Bug size={14} className="text-amber-500" />
                                    {t('grammar.syntax_sandbox')} <span className="text-[10px] text-amber-200 px-1.5 rounded border border-amber-800" style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)' }}>Alpha</span>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={testSentence}
                                    onChange={(e) => setTestSentence(e.target.value)}
                                    className="flex-1 rounded px-3 py-2 text-sm focus:outline-none font-mono"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', border: '1px solid' }}
                                    placeholder={t('grammar.type_sentence')}
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="p-2 rounded transition-colors disabled:opacity-50 shadow-lg"
                                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
                                >
                                    <Play size={18} fill="currentColor" />
                                </button>
                            </div>
                        </Card>

                        <Card className="flex-1 p-4 overflow-hidden flex flex-col">
                            <div className="text-xs font-semibold uppercase tracking-wider mb-2 border-b pb-2 flex justify-between" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                {t('grammar.analysis_output')}
                                {output && <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>AI Generated</span>}
                            </div>
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                {loading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--surface)' }}></div>
                                        <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--surface)' }}></div>
                                        <div className="h-4 rounded w-full" style={{ backgroundColor: 'var(--surface)' }}></div>
                                    </div>
                                ) : output ? (
                                    <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{output}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-50" style={{ color: 'var(--text-tertiary)' }}>
                                        <Lightbulb size={32} className="mb-2 text-amber-500/50" />
                                        <div className="text-xs italic text-center max-w-[200px]">
                                            {t('grammar.sandbox_desc')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                    <MorphologyEditor
                        data={morphology}
                        setData={setMorphology}
                        scriptConfig={scriptConfig}
                        isScriptMode={isScriptMode}
                    />
                </div>
            )}
            </div>
        </ViewLayout>
    );
};

export default GrammarEditor;