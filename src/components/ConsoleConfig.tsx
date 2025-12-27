import { Terminal, ArrowRight, Zap, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ProjectConstraints, AppSettings, LexiconEntry, LogEntry, ViewState, POS_SUGGESTIONS, ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { isApiKeySet, processCommandAI, repairLexicon } from '../services/geminiService';

const calculateSimilarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 100;

    const editDistance = (a: string, b: string) => {
        const costs = [];
        for (let i = 0; i <= a.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (a.charAt(i - 1) !== b.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[b.length] = lastValue;
        }
        return costs[b.length];
    };

    const dist = editDistance(longer, shorter);
    return Math.round(((longerLength - dist) / longerLength) * 100);
};

interface RepairTableProps {
    repairs: Array<{ id: string, word: string, ipa: string }>;
    originalEntries: LexiconEntry[];
    onCommit: (repairedList: Array<{ id: string, word: string, ipa: string }>) => void;
    onCancel: () => void;
    t: (key: string) => string;
}

const RepairReviewTable: React.FC<RepairTableProps> = ({ repairs, originalEntries, onCommit, onCancel, t }) => {
    const [localRepairs, setLocalRepairs] = useState(repairs);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(repairs.map(r => r.id)));
    const [isApplied, setIsApplied] = useState(false);

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const updateLocalRepair = (id: string, field: 'word' | 'ipa', value: string) => {
        setLocalRepairs(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    if (isApplied) {
        return (
            <div className="py-2 px-4 bg-emerald-950/20 border border-emerald-900/50 rounded flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 size={14} /> {t('console.refactor_complete') || 'Refactoring complete and integrated.'}
            </div>
        );
    }

    return (
        <div
            className="my-4 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={12} className="text-amber-500" /> STAGING v4.6: {t('console.review_proposals') || 'REVIEW PROPOSALS'}
                </span>
                <span className="text-[10px] text-zinc-500">{selectedIds.size} {t('lexicon.results_count') || 'selected'}</span>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                <table className="w-full text-[11px]">
                    <thead className="bg-black/20 text-zinc-500 sticky top-0 z-10">
                        <tr>
                            <th className="p-2 text-center w-8"></th>
                            <th className="p-2 text-left">{t('console.table_original')}</th>
                            <th className="p-2 text-center">{t('console.table_fidelity')}</th>
                            <th className="p-2 text-left text-amber-400">{t('console.table_ai_proposal')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {localRepairs.map(repair => {
                            const original = originalEntries.find(e => e.id === repair.id);
                            const isSelected = selectedIds.has(repair.id);
                            const score = original ? calculateSimilarity(original.word, repair.word) : 0;

                            return (
                                <tr key={repair.id} className={`hover: bg - zinc - 800 / 50 transition - colors ${!isSelected ? 'opacity-30' : ''} `}>
                                    <td className="p-2 text-center">
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelection(repair.id)} className="rounded bg-black border-zinc-700 text-purple-600" />
                                    </td>
                                    <td className="p-2">
                                        <div className="font-bold text-zinc-400">{original?.word}</div>
                                        <div className="text-[9px] opacity-40 font-mono">/{original?.ipa}/</div>
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className={`font - mono font - bold px - 1.5 py - 0.5 rounded ${score < 50 ? 'bg-red-900/30 text-red-500' : 'bg-emerald-900/20 text-emerald-500'} `}>
                                            {score}%
                                        </div>
                                    </td>
                                    <td className="p-2 space-y-1">
                                        <input
                                            value={repair.word}
                                            onChange={(e) => updateLocalRepair(repair.id, 'word', e.target.value)}
                                            disabled={!isSelected}
                                            className="w-full bg-black border border-zinc-800 rounded px-1.5 py-0.5 font-bold text-emerald-400 focus:border-purple-500 outline-none"
                                        />
                                        <input
                                            value={repair.ipa}
                                            onChange={(e) => updateLocalRepair(repair.id, 'ipa', e.target.value)}
                                            disabled={!isSelected}
                                            className="w-full bg-black border border-zinc-800 rounded px-1.5 py-0.5 text-emerald-600 font-mono text-[9px] focus:border-purple-500 outline-none"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-3 bg-black/40 border-t border-zinc-700 flex justify-end gap-2">
                <button onClick={onCancel} className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-300">{t('common.cancel')}</button>
                <button
                    onClick={() => {
                        const finalRepairs = localRepairs.filter(r => selectedIds.has(r.id));
                        onCommit(finalRepairs);
                        setIsApplied(true);
                    }}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold shadow-lg flex items-center gap-2"
                >
                    {t('common.apply') || 'Apply Changes'} ({selectedIds.size})
                </button>
            </div>
        </div>
    );
};

interface ConsoleConfigProps {
    constraints: ProjectConstraints;
    setConstraints: (c: ProjectConstraints) => void;
    settings: AppSettings;
    setSettings: (s: AppSettings) => void;
    entries: LexiconEntry[];
    setEntries: React.Dispatch<React.SetStateAction<LexiconEntry[]>>;
    history: LogEntry[];
    setHistory: React.Dispatch<React.SetStateAction<LogEntry[]>>;
    setProjectName: (name: string) => void;
    setProjectDescription: (desc: string) => void;
    setProjectAuthor: (author: string) => void;
    setIsSidebarOpen: (open: boolean) => void;
    setView: (view: ViewState) => void;
    setJumpToTerm: (term: string | null) => void;
    setDraftEntry: (entry: Partial<LexiconEntry> | null) => void;
    scriptConfig?: ScriptConfig;
    isScriptMode?: boolean;
    author?: string;
}

const TERMINAL_HEADER = `
██╗  ██╗ ██████╗ ██████╗ ███████╗██╗      █████╗ ███╗   ██╗ ██████╗ 
██║ ██╔╝██╔═══██╗██╔══██╗██╔════╝██║     ██╔══██╗████╗  ██║██╔════╝ 
█████╔╝ ██║   ██║██████╔╝█████╗  ██║     ███████║██╔██╗ ██║██║  ███╗
██╔═██╗ ██║   ██║██╔══██╗██╔══╝  ██║     ██╔══██║██║╚██╗██║██║   ██║
██║  ██╗╚██████╔╝██║  ██║███████╗███████╗██║  ██║██║ ╚████║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
`;

const ConsoleConfig: React.FC<ConsoleConfigProps> = ({
    constraints, setConstraints, settings, setSettings, entries, setEntries, history, setHistory,
    setProjectName, setProjectDescription, setProjectAuthor, setIsSidebarOpen, setView, setJumpToTerm, setDraftEntry, scriptConfig, isScriptMode = false, author = 'user'
}) => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    const addLog = (type: LogEntry['type'], content: string, component?: React.ReactNode) => {
        const timestamp = new Date().toLocaleTimeString();
        setHistory(prev => [...prev, { type, content, timestamp, component }]);
    };

    const clearTerminal = () => {
        setHistory([{
            type: 'info', content: TERMINAL_HEADER,
            timestamp: ''
        }]);
    };

    useEffect(() => {
        if (history.length === 0) {
            clearTerminal();
            handleCommand('HELP');
        }
    }, [history, t, clearTerminal]);

    const handleCommand = async (cmdStr: string) => {
        if (!cmdStr.trim()) return;
        addLog('command', cmdStr);
        const args = cmdStr.match(/[^\s"]+|"([^"]*)"/g)?.map(a => a.replace(/"/g, '')) || [];
        const cmd = args[0]?.toUpperCase();

        try {
            switch (cmd) {
                case 'CLEAR': case 'CLS': clearTerminal(); break;
                case 'FIX-NON-CANON':
                    if (!settings.enableAI) throw new Error(t('console.ai_service_disabled'));
                    const invalid = entries.filter(e => {
                        // Validación simplificada para el comando
                        const w = e.word.toLowerCase();
                        return constraints.bannedSequences.some(s => w.includes(s.toLowerCase()));
                    });
                    if (invalid.length === 0) {
                        addLog('success', t('console.no_violations') || 'The lexicon complies with the current phonotactic rules.');
                        break;
                    }
                    addLog('info', `${t('console.analyzing') || 'Analyzing'} ${invalid.length} ${t('console.violations') || 'violations'}...`);
                    setLoadingAI(true);
                    const result = await repairLexicon(invalid, constraints);
                    // Falsa carga para feedback visual
                    setTimeout(() => setLoadingAI(false), 500);
                    if (result.success && result.repairs) {
                        addLog('info', t('console.proposals_review'), (
                            <RepairReviewTable repairs={result.repairs} originalEntries={entries} t={t}
                                onCommit={(repairedList) => {
                                    setEntries(prev => prev.map(entry => {
                                        const rep = repairedList.find(r => r.id === entry.id);
                                        return rep ? { ...entry, word: rep.word, ipa: rep.ipa } : entry;
                                    }));
                                }}
                                onCancel={() => addLog('info', t('console.repair_aborted'))}
                            />
                        ));
                    } else throw new Error(result.message || t('console.ai_pipeline_failed'));
                    break;
                case 'HELP':
                    addLog('output', t('console.available_commands') || 'AVAILABLE COMMANDS:');
                    addLog('output', 'FIX-NON-CANON - ' + (t('console.help_fix') || 'Repairs words that violate the project rules.'));
                    addLog('output', 'CLEAR - ' + (t('console.help_clear') || 'Clears the terminal history.'));
                    addLog('output', 'ABOUT - ' + (t('console.help_about') || 'Shows information about the application.'));
                    break;
                case 'ABOUT':
                    addLog('output', t('msg.about_desc'));
                    break;
                default:
                    // Support for free-form instructions via /ai
                    if (cmdStr.startsWith('/ai ')) {
                        const instruction = cmdStr.slice(4).trim();
                        if (!instruction) return;

                        if (!isApiKeySet()) {
                            addLog('error', 'AI Command Failed: No API Key configured.');
                            addLog('info', 'Configure your API Key in the Preferences menu (Settings icon) to enable AI features.', (
                                <div className="mt-2 p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg text-xs text-amber-200 flex items-start gap-3">
                                    <ShieldAlert size={16} className="shrink-0 text-amber-500" />
                                    <div>
                                        Go to <b>Preferences (Settings) {' > '} General</b> and enter your Gemini API Key.
                                    </div>
                                </div>
                            ));
                            return;
                        }

                        setLoadingAI(true);
                        const result = await processCommandAI(entries, instruction, constraints);
                        setLoadingAI(false);
                        if (result.success && result.newLexicon) {
                            setEntries(result.newLexicon);
                            addLog('success', t('console.ai_applied_count').replace('{{count}}', result.modifiedCount.toString()));
                        } else {
                            addLog('error', (result as any).message || t('console.processing_error'));
                        }
                        return;
                    }
                    addLog('error', `Command not recognized by KoreLang Core.`);
            }
        } catch (e: any) { addLog('error', e.message); }
    };

    return (
        <div className="h-full flex flex-col bg-[var(--bg-main)] font-mono text-sm relative">
            <div className="p-2 bg-[var(--bg-panel)] border-b border-white/5 flex justify-between items-center text-xs text-[var(--text-2)]">
                <span className="flex items-center gap-2"><Terminal size={14} /> {t('console.kernel_version')}</span>
                <span className="flex items-center gap-2">
                    {loadingAI && <Zap size={12} className="animate-pulse text-purple-500" />}
                    SYSTEM_READY
                </span>
            </div>
            <div
                className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((log, i) => (
                    <div key={i} className={`flex flex - col ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-400' : log.type === 'command' ? 'text-[var(--text-1)] font-bold' : 'text-[var(--text-2)]'} `}>
                        <div className="flex gap-3 leading-relaxed">
                            {log.type === 'command' && <span className="text-emerald-500">KoreLang-@{author}:~$</span>}
                            <span className={log.content === TERMINAL_HEADER ? "whitespace-pre text-blue-400 font-bold leading-none" : ""}>{log.content}</span>
                        </div>
                        {log.component && <div className="mt-2 mb-4">{log.component}</div>}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="p-4 bg-[var(--bg-main)] border-t border-white/5 flex items-center gap-3">
                <span className="text-emerald-500 font-bold">KoreLang-@{author}:~$</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') { handleCommand(input); setInput(''); }
                    }}
                    className="bg-transparent border-none outline-none text-[var(--text-1)] w-full"
                    placeholder={t('console.placeholder')}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

export default ConsoleConfig;
