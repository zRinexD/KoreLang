import React, { useState } from 'react';
import { Languages, Play, CheckCircle, Table, Code, Bug, Lightbulb, Box, Link } from 'lucide-react';
import { analyzeSyntax } from '../services/geminiService';
import MorphologyEditor from './MorphologyEditor';
import CodeEditor from './CodeEditor';
import { MorphologyState, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';

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
        <div className="h-full flex flex-col p-6 max-w-7xl mx-auto w-full gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                        <Languages style={{ color: 'var(--accent)' }} />
                        {t('grammar.title')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('grammar.desc')}</p>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setActiveTab('SYNTAX')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'SYNTAX'
                            ? 'shadow-lg'
                            : ''
                            }`}
                        style={activeTab === 'SYNTAX' ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { if (activeTab !== 'SYNTAX') e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { if (activeTab !== 'SYNTAX') e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <Code size={16} /> {t('grammar.tab.syntax')}
                    </button>
                    <button
                        onClick={() => setActiveTab('MORPHOLOGY')}
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'MORPHOLOGY'
                            ? 'shadow-lg'
                            : ''
                            }`}
                        style={activeTab === 'MORPHOLOGY' ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { if (activeTab !== 'MORPHOLOGY') e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { if (activeTab !== 'MORPHOLOGY') e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <Table size={16} /> {t('grammar.tab.morphology')}
                    </button>
                </div>
            </div>

            {activeTab === 'SYNTAX' ? (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden animate-in fade-in duration-300">
                    {/* BNF Editor Panel */}
                    <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
                        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{t('grammar.bnfc')}</span>
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
                    </div>

                    {/* Test Console */}
                    <div className="w-full lg:w-96 flex flex-col gap-4">

                        {/* VISUAL VALIDATION OF MORPHOLOGY CONNECTION */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)' }}>
                                <Box size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('grammar.morph_context')}</div>
                                <div className="text-[10px] text-slate-500 flex gap-2 mt-0.5">
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
                                <div className="text-xs font-bold px-2 py-1 bg-slate-900 rounded border border-slate-800" style={{ color: 'var(--text-secondary)' }}>{t('grammar.no_rules')}</div>
                            )}
                        </div>

                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Bug size={14} className="text-amber-500" />
                                    {t('grammar.syntax_sandbox')} <span className="text-[10px] bg-amber-900/50 text-amber-200 px-1.5 rounded border border-amber-800">Alpha</span>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={testSentence}
                                    onChange={(e) => setTestSentence(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 text-sm focus:border-emerald-500 outline-none font-mono"
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
                        </div>

                        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-lg overflow-hidden flex flex-col">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2 flex justify-between">
                                {t('grammar.analysis_output')}
                                {output && <span className="text-[10px] text-slate-600">AI Generated</span>}
                            </div>
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                {loading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    </div>
                                ) : output ? (
                                    <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">{output}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                        <Lightbulb size={32} className="mb-2 text-amber-500/50" />
                                        <div className="text-xs italic text-center max-w-[200px]">
                                            {t('grammar.sandbox_desc')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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
    );
};

export default GrammarEditor;