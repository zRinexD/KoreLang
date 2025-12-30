import React, { useState } from 'react';
import { Languages, Play, CheckCircle, Table, Code, Bug, Lightbulb, Box, Link } from 'lucide-react';
import { analyzeSyntax } from '../services/geminiService';
import MorphologyEditor from './MorphologyEditor';
import CodeEditor from './CodeEditor';
import { MorphologyState, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { Card, Section, ViewLayout, CompactButton, ToggleButton, FormField, StatBadge } from './ui';

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

            <div className="p-4 max-w-7xl mx-auto w-full h-full overflow-hidden flex flex-col">
            {activeTab === 'SYNTAX' ? (
                <div className="h-full flex flex-col lg:flex-row gap-4 overflow-hidden">
                    {/* BNF Editor Panel */}
                    <div className="flex-1 flex flex-col overflow-hidden rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t('grammar.bnfc')}</span>
                                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}><CheckCircle size={12} /> {t('grammar.saved')}</span>
                            </div>
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
                    <div className="w-full lg:w-96 flex flex-col gap-4 overflow-hidden">

                        {/* VISUAL VALIDATION OF MORPHOLOGY CONNECTION */}
                        <Card className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--elevated)', color: 'var(--accent)' }}>
                                <Box size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t('grammar.morph_context')}</div>
                                <div className="text-[10px] flex gap-2 mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                    <span>{totalParadigms} paradigms</span>
                                    <span>•</span>
                                    <span>{totalRules} rules</span>
                                </div>
                            </div>
                            {totalRules > 0 ? (
                                <div className="text-xs font-bold px-2 py-1 rounded border flex items-center gap-1" style={{ color: 'var(--accent)', backgroundColor: 'var(--elevated)', borderColor: 'var(--accent)' }}>
                                    <Link size={10} /> Linked
                                </div>
                            ) : (
                                <div className="text-xs font-bold px-2 py-1 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>No Rules</div>
                            )}
                        </Card>

                        <Card className="p-4">
                            <FormField label={t('grammar.syntax_sandbox')}>
                                <div className="flex gap-2 items-center">
                                    <input
                                        value={testSentence}
                                        onChange={(e) => setTestSentence(e.target.value)}
                                        className="flex-1 rounded px-3 py-2 text-sm focus:outline-none font-mono border"
                                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                        placeholder={t('grammar.type_sentence')}
                                    />
                                    <CompactButton
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        variant="outline"
                                        color="var(--accent)"
                                        icon={<Play size={13} fill="currentColor" />}
                                        label=""
                                        className="h-[34px] px-2.5"
                                    />
                                </div>
                            </FormField>
                        </Card>

                        <Card className="flex-1 p-4 overflow-hidden flex flex-col h-full">
                            <div className="text-xs font-semibold uppercase tracking-wider mb-2 border-b pb-2 flex justify-between items-center" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                <span>{t('grammar.analysis_output')}</span>
                                {output && <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>AI</span>}
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--elevated)' }}></div>
                                        <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--elevated)' }}></div>
                                        <div className="h-4 rounded w-full" style={{ backgroundColor: 'var(--elevated)' }}></div>
                                    </div>
                                ) : output ? (
                                    <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{output}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-50" style={{ color: 'var(--text-tertiary)' }}>
                                        <Lightbulb size={32} className="mb-2" style={{ color: 'var(--accent)', opacity: 0.5 }} />
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
                <div className="h-full overflow-hidden animate-in fade-in duration-300">
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