import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, BookA, GitFork, ArrowRight, Link, Filter, X, SlidersHorizontal, ShieldAlert, AlertTriangle, HelpCircle, AlertOctagon, Edit, Ban, Eye, EyeOff, Copy, Check, Feather, Type, Mic, Pin, PinOff } from 'lucide-react';
import { LexiconEntry, POS_SUGGESTIONS, ProjectConstraints, PhonologyConfig, ScriptConfig } from '../types';
import Combobox from './Combobox';
import GenWord from './GenWord';
import { ConScriptText } from './ConScriptRenderer';
import { useTranslation } from '../i18n';
import { searchLexicon, SearchResult } from '../services/searchService';
import { isApiKeySet } from '../services/geminiService';

interface LexiconProps {
    entries: LexiconEntry[];
    setEntries: React.Dispatch<React.SetStateAction<LexiconEntry[]>>;
    constraints: ProjectConstraints;
    enableAI: boolean;
    phonology: PhonologyConfig;
    genWordState: any;
    setGenWordState: any;
    jumpToTerm?: string | null;
    setJumpToTerm?: (term: string | null) => void;
    draftEntry?: Partial<LexiconEntry> | null;
    setDraftEntry?: (entry: Partial<LexiconEntry> | null) => void;
    scriptConfig?: ScriptConfig;
    isScriptMode?: boolean;
}

type ConflictViewMode = 'PINNED' | 'HIDDEN' | 'ONLY';

// IPA KEYBOARD DATA
const IPA_SYMBOLS = {
    'Vowels': ['i', 'y', 'ɨ', 'ʉ', 'ɯ', 'u', 'ɪ', 'ʏ', 'ʊ', 'e', 'ø', 'ɘ', 'ɵ', 'ɤ', 'o', 'ə', 'ɛ', 'œ', 'ɜ', 'ɞ', 'ʌ', 'ɔ', 'æ', 'ɐ', 'a', 'ɶ', 'ɑ', 'ɒ'],
    'Consonants': ['p', 'b', 't', 'd', 'ʈ', 'ɖ', 'c', 'ɟ', 'k', 'g', 'q', 'ɢ', 'ʔ', 'm', 'n', 'ɳ', 'ɲ', 'ŋ', 'ɴ', 'ʙ', 'r', 'ʀ', 'ɾ', 'ɽ', 'ɸ', 'β', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'ʂ', 'ʐ', 'ç', 'ʝ', 'x', 'ɣ', 'χ', 'ʁ', 'ħ', 'ʕ', 'h', 'ɦ', 'ɬ', 'ɮ', 'ʋ', 'ɹ', 'j', 'ɰ', 'l', 'ɭ', 'ʎ', 'ʟ'],
    'Diacritics': ['ˈ', 'ˌ', 'ː', 'ˑ', 'ʰ', 'ʲ', 'ʷ', 'ˤ', '̃', '̚', '̪', '̥', '̬']
};

const Lexicon: React.FC<LexiconProps> = ({
    entries, setEntries, constraints, enableAI, phonology,
    genWordState, setGenWordState, jumpToTerm, setJumpToTerm,
    draftEntry, setDraftEntry, scriptConfig, isScriptMode = false
}) => {
    const { t, i18n: i18nInstance } = useTranslation();
    const direction = i18nInstance.dir();
    const [activeTab, setActiveTab] = useState<'BROWSE' | 'GENERATE'>('BROWSE');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [posFilter, setPosFilter] = useState<string>('ALL');
    const [conflictMode, setConflictMode] = useState<ConflictViewMode>('PINNED');
    const [searchFields, setSearchFields] = useState({
        word: true, definition: true, etymology: true, ipa: true
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [entryToDelete, setEntryToDelete] = useState<LexiconEntry | null>(null);
    const [dependentsWarning, setDependentsWarning] = useState<LexiconEntry[]>([]);
    const [showSimpleDeleteConfirm, setShowSimpleDeleteConfirm] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newIPA, setNewIPA] = useState('');
    const [newPOS, setNewPOS] = useState<string>('Noun');
    const [newDefinition, setNewDefinition] = useState('');
    const [newEtymology, setNewEtymology] = useState('');
    const [newDerivedFrom, setNewDerivedFrom] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // IPA KEYBOARD STATE
    const [showIPAKeyboard, setShowIPAKeyboard] = useState(false);
    const [pinIPAKeyboard, setPinIPAKeyboard] = useState(false);

    // Smart Copy Feedback State
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (jumpToTerm) {
            setSearchTerm(jumpToTerm);
            if (setJumpToTerm) setJumpToTerm(null);
        }
    }, [jumpToTerm, setJumpToTerm]);

    useEffect(() => {
        if (draftEntry) {
            setEditingEntryId(null);
            setNewWord(draftEntry.word || '');
            setNewIPA(draftEntry.ipa || '');
            setNewPOS(draftEntry.pos || 'Noun');
            setNewDefinition(draftEntry.definition || '');
            setNewEtymology(draftEntry.etymology || '');
            setNewDerivedFrom(draftEntry.derivedFrom || '');
            setIsModalOpen(true);
            if (setDraftEntry) setDraftEntry(null);
        }
    }, [draftEntry, setDraftEntry]);

    const getPosLabel = (posKey: string) => t(`pos.${posKey}` as any) || posKey;

    const isConsonant = (char: string) => {
        if (phonology.consonants.length === 0) return !'aeiouàáèéìíòóùú'.includes(char.toLowerCase());
        return phonology.consonants.some(c => c.symbol === char) || !'aeiouàáèéìíòóùú'.includes(char.toLowerCase());
    };

    const isVowel = (char: string) => {
        if (phonology.vowels.length === 0) return 'aeiouàáèéìíòóùú'.includes(char.toLowerCase());
        return phonology.vowels.some(v => v.symbol === char) || 'aeiouàáèéìíòóùú'.includes(char.toLowerCase());
    };

    const getCVPattern = (word: string) => {
        return word.split('').map(char => {
            if (phonology.vowels.some(v => v.symbol === char)) return 'V';
            if (phonology.consonants.some(c => c.symbol === char)) return 'C';
            if ('aeiouàáèéìíòóùú'.includes(char.toLowerCase())) return 'V';
            return 'C';
        }).join('');
    };

    const checkConformance = useCallback((word: string, pos: string): string[] => {
        const errors: string[] = [];
        const wRaw = word.trim();
        if (!wRaw) return [];
        const wCheck = constraints.caseSensitive ? wRaw : wRaw.toLowerCase();

        constraints.bannedSequences.forEach(seq => {
            const sCheck = constraints.caseSensitive ? seq : seq.toLowerCase();
            if (wCheck.includes(sCheck)) errors.push(t('val.banned_seq') + `: "${seq}"`);
        });

        if (constraints.allowedGraphemes) {
            try {
                const flags = constraints.caseSensitive ? '' : 'i';
                const regex = new RegExp(`^['${constraints.allowedGraphemes}]+$`, flags);
                if (!regex.test(wRaw)) errors.push(t('val.invalid_char') + ` ([${constraints.allowedGraphemes}])`);
            } catch (e) { console.warn("Invalid Regex in Constraints"); }
        }

        if (constraints.mustStartWith?.length > 0) {
            const rules = constraints.mustStartWith.filter(r => !r.conditionPos || r.conditionPos === pos);
            if (rules.length > 0) {
                const starts = rules.some(r => {
                    if (r.target === 'C') return isConsonant(wRaw.charAt(0));
                    if (r.target === 'V') return isVowel(wRaw.charAt(0));
                    return wRaw.startsWith(r.target);
                });
                if (!starts) errors.push(t('val.must_start'));
            }
        }

        if (constraints.mustEndWith?.length > 0) {
            const rules = constraints.mustEndWith.filter(r => !r.conditionPos || r.conditionPos === pos);
            if (rules.length > 0) {
                const ends = rules.some(r => {
                    if (r.target === 'C') return isConsonant(wRaw.charAt(wRaw.length - 1));
                    if (r.target === 'V') return isVowel(wRaw.charAt(wRaw.length - 1));
                    return wRaw.endsWith(r.target);
                });
                if (!ends) errors.push(t('val.must_end'));
            }
        }

        if (constraints.phonotacticStructure) {
            const pattern = getCVPattern(wRaw);
            try {
                const structRegex = new RegExp(constraints.phonotacticStructure);
                if (!structRegex.test(pattern)) errors.push(t('val.structure_fail') + ` (${pattern})`);
            } catch (e) { }
        }
        return errors;
    }, [constraints, phonology, t]);

    useEffect(() => {
        const errors = checkConformance(newWord, newPOS);
        if (!constraints.allowDuplicates && newWord.trim()) {
            const wCheck = constraints.caseSensitive ? newWord.trim() : newWord.trim().toLowerCase();
            const isDuplicate = entries.some(e => {
                if (editingEntryId && e.id === editingEntryId) return false;
                return (constraints.caseSensitive ? e.word : e.word.toLowerCase()) === wCheck;
            });
            if (isDuplicate) errors.push(t('val.duplicate') + ` "${newWord}"`);
        }
        setValidationErrors(errors);
    }, [newWord, newPOS, constraints, entries, editingEntryId, checkConformance]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const isSearching = debouncedSearchTerm.trim() !== '' || posFilter !== 'ALL';
        if (isSearching) {
            setSearchResults(searchLexicon(entries, {
                query: debouncedSearchTerm,
                filters: { pos: posFilter },
                fields: searchFields
            }));
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, posFilter, searchFields, entries]);

    const totalConflictCount = useMemo(() => entries.filter(e => checkConformance(e.word, e.pos).length > 0).length, [entries, checkConformance]);

    const groupedEntries = useMemo(() => {
        if (debouncedSearchTerm || posFilter !== 'ALL') return {};
        let sorted = [...entries];
        if (constraints.customSortingOrder) {
            const orderString = constraints.customSortingOrder.replace(/\s+/g, '');
            const orderMap = new Map<string, number>();
            for (let i = 0; i < orderString.length; i++) orderMap.set(orderString[i], i);
            sorted.sort((a, b) => {
                const wordA = a.word;
                const wordB = b.word;
                const minLen = Math.min(wordA.length, wordB.length);
                for (let i = 0; i < minLen; i++) {
                    const charA = wordA[i];
                    const charB = wordB[i];
                    if (charA !== charB) {
                        const idxA = orderMap.get(charA) ?? 9999 + charA.charCodeAt(0);
                        const idxB = orderMap.get(charB) ?? 9999 + charB.charCodeAt(0);
                        return idxA - idxB;
                    }
                }
                return wordA.length - wordB.length;
            });
        } else {
            const locale = constraints.sortingLocale || undefined;
            sorted.sort((a, b) => a.word.localeCompare(b.word, locale, { sensitivity: 'base' }));
        }

        const groups: Record<string, LexiconEntry[]> = {};
        const conflictKey = t('lexicon.conflicts_group');

        sorted.forEach(entry => {
            const errors = checkConformance(entry.word, entry.pos);
            const isConflict = errors.length > 0;
            if (conflictMode === 'HIDDEN' && isConflict) return;
            if (conflictMode === 'ONLY' && !isConflict) return;
            if (isConflict && conflictMode === 'PINNED') {
                if (!groups[conflictKey]) groups[conflictKey] = [];
                groups[conflictKey].push(entry);
            } else {
                let firstLetter = entry.word.charAt(0).toUpperCase();
                if (!groups[firstLetter]) groups[firstLetter] = [];
                groups[firstLetter].push(entry);
            }
        });
        return groups;
    }, [entries, debouncedSearchTerm, posFilter, conflictMode, checkConformance, t, constraints]);

    const sortedKeys = useMemo(() => {
        const keys = Object.keys(groupedEntries);
        const conflictKey = t('lexicon.conflicts_group');
        const hasConflicts = keys.includes(conflictKey);
        const regularKeys = keys.filter(k => k !== conflictKey);

        if (constraints.customSortingOrder) {
            const orderString = constraints.customSortingOrder.replace(/\s+/g, '');
            const orderMap = new Map<string, number>();
            for (let i = 0; i < orderString.length; i++) {
                orderMap.set(orderString[i], i);
                orderMap.set(orderString[i].toUpperCase(), i);
            }
            regularKeys.sort((a, b) => {
                const idxA = orderMap.get(a) ?? 9999 + a.charCodeAt(0);
                const idxB = orderMap.get(b) ?? 9999 + b.charCodeAt(0);
                return idxA - idxB;
            });
        } else {
            const locale = constraints.sortingLocale || undefined;
            regularKeys.sort((a, b) => a.localeCompare(b, locale));
        }
        return hasConflicts ? [conflictKey, ...regularKeys] : regularKeys;
    }, [groupedEntries, t, constraints]);

    const toggleConflictMode = () => setConflictMode(prev => prev === 'HIDDEN' ? 'PINNED' : 'HIDDEN');
    const openAddModal = () => { setEditingEntryId(null); resetForm(); setIsModalOpen(true); };
    const openEditModal = (entry: LexiconEntry) => {
        setEditingEntryId(entry.id);
        setNewWord(entry.word);
        setNewIPA(entry.ipa);
        setNewPOS(entry.pos);
        setNewDefinition(entry.definition);
        setNewEtymology(entry.etymology || '');
        setNewDerivedFrom(entry.derivedFrom || '');
        setIsModalOpen(true);
    };

    const handleSaveEntry = () => {
        if (validationErrors.length > 0 || !newWord || !newDefinition) return;
        const entryData: LexiconEntry = {
            id: editingEntryId || Date.now().toString(),
            word: newWord, ipa: newIPA, pos: newPOS, definition: newDefinition,
            etymology: newEtymology, derivedFrom: newDerivedFrom || undefined
        };
        setEntries(prev => editingEntryId ? prev.map(e => e.id === editingEntryId ? entryData : e) : [...prev, entryData]);
        setIsModalOpen(false);
        resetForm();
    };

    const handleDraftEntry = (draft: Partial<LexiconEntry>) => {
        setEditingEntryId(null);
        setNewWord(draft.word || '');
        setNewIPA(draft.ipa || '');
        setNewPOS(draft.pos || 'Noun');
        setNewDefinition(draft.definition || '');
        setNewEtymology('');
        setNewDerivedFrom('');
        setIsModalOpen(true);
        setActiveTab('BROWSE');
    };

    const handleBulkAdd = (words: LexiconEntry[]) => {
        setEntries(prev => [...prev, ...words]);
        setActiveTab('BROWSE');
    };

    const resetForm = () => {
        setNewWord(''); setNewIPA(''); setNewPOS('Noun'); setNewDefinition('');
        setNewEtymology(''); setNewDerivedFrom(''); setValidationErrors([]);
    };

    const requestDelete = (entry: LexiconEntry, e: React.MouseEvent) => {
        e.stopPropagation();
        const dependents = entries.filter(e => e.derivedFrom === entry.id);
        setEntryToDelete(entry);
        if (dependents.length > 0) setDependentsWarning(dependents);
        else setShowSimpleDeleteConfirm(true);
    };

    const confirmSimpleDelete = () => { if (entryToDelete) performDelete(entryToDelete.id); cancelDelete(); };
    const performDelete = (id: string) => { setEntries(prev => prev.filter(e => e.id !== id)); cancelDelete(); };
    const performUnlinkAndDelete = () => {
        if (!entryToDelete) return;
        setEntries(prev => prev.filter(e => e.id !== entryToDelete.id).map(e => e.derivedFrom === entryToDelete.id ? { ...e, derivedFrom: undefined } : e));
        cancelDelete();
    };
    const cancelDelete = () => { setEntryToDelete(null); setDependentsWarning([]); setShowSimpleDeleteConfirm(false); };

    // --- SMART COPY LOGIC (FIXED) ---
    const handleCopyText = (entry: LexiconEntry) => {
        navigator.clipboard.writeText(entry.word).then(() => {
            setCopiedId(`${entry.id}-text`);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleCopyScript = (entry: LexiconEntry) => {
        if (scriptConfig && scriptConfig.glyphs) {
            const textToCopy = entry.word.split('').map(char => {
                const glyph = scriptConfig.glyphs.find(g => g.char === char);
                if (glyph && glyph.pua) {
                    try {
                        return JSON.parse(`"${glyph.pua}"`);
                    } catch (e) { return char; }
                }
                return char;
            }).join('');

            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopiedId(`${entry.id}-script`);
                setTimeout(() => setCopiedId(null), 2000);
            });
        }
    };

    // IPA Keyboard Handler
    const handleIPAInsert = (char: string) => {
        setNewIPA(prev => prev + char);
    };

    const jumpToWord = (word: string) => setSearchTerm(word);
    const toggleField = (field: keyof typeof searchFields) => setSearchFields(prev => ({ ...prev, [field]: !prev[field] }));

    const renderEntryCard = (entry: LexiconEntry) => {
        const parent = entries.find(e => e.id === entry.derivedFrom);
        const descendants = entries.filter(e => e.derivedFrom === entry.id);
        const entryErrors = checkConformance(entry.word, entry.pos);
        const isInvalid = entryErrors.length > 0;

        return (
            <div key={entry.id} className={`bg-neutral-900 border ${isInvalid ? 'border-red-900/30' : 'border-neutral-800'} rounded-lg p-4 hover:border-neutral-600 transition-colors group relative overflow-hidden`}>
                {entry.derivedFrom && <GitFork className={`absolute ${direction === 'rtl' ? '-left-4 -scale-x-100' : '-right-4'} -top-4 text-neutral-800 opacity-20 w-32 h-32 rotate-12`} />}

                <div className="flex justify-between items-start relative z-10">
                    <div className="w-full">
                        <div className="flex items-baseline gap-3 mb-1">
                            {/* OMNI-GLYPH LOGIC */}
                            {isScriptMode ? (
                                <div className="flex flex-col">
                                    <div className="text-4xl text-purple-200 leading-none mb-1">
                                        <ConScriptText text={entry.word} scriptConfig={scriptConfig} />
                                    </div>
                                    <span className="text-xs font-mono text-neutral-500">{entry.word}</span>
                                </div>
                            ) : (
                                <h3 className="text-2xl font-serif text-neutral-100 font-bold">{entry.word}</h3>
                            )}

                            <span className="text-neutral-400 font-mono text-sm bg-neutral-800 px-2 py-0.5 rounded">/{entry.ipa}/</span>
                            <span className="text-blue-400 text-xs uppercase font-bold tracking-wider border border-blue-900 bg-blue-950/30 px-1.5 rounded">{getPosLabel(entry.pos)}</span>
                            {isInvalid && (
                                <div className="group/badge relative">
                                    <span className="flex items-center gap-1 text-red-400 text-[10px] uppercase font-bold tracking-wider border border-dashed border-red-500/30 bg-red-950/20 px-1.5 rounded cursor-help">
                                        <Ban size={10} /> {t('lexicon.non_canon')}
                                    </span>
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/badge:block bg-neutral-900 text-neutral-300 text-xs p-3 rounded-lg border border-neutral-700 whitespace-nowrap z-50 shadow-xl">
                                        <div className="font-bold text-neutral-100 mb-1 flex items-center gap-2"><AlertTriangle size={12} className="text-red-400" /> {t('val.errors_title')}</div>
                                        {entryErrors.map((e, i) => <div key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{e}</div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-neutral-300 text-lg mb-3 mt-1">{entry.definition}</p>

                        {(parent || descendants.length > 0 || entry.etymology) && (
                            <div className="bg-neutral-950/50 rounded-md p-3 border border-neutral-800/50 space-y-2">
                                {entry.etymology && <div className="text-neutral-500 text-sm italic mb-1">"{entry.etymology}"</div>}
                                <div className="flex flex-wrap items-center gap-y-2 text-sm">
                                    {parent ? (
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <Link size={12} />
                                            <span>{t('lexicon.derived_from') || 'Derived From'}:</span>
                                            <button onClick={() => jumpToWord(parent.word)} className="text-amber-500 hover:text-amber-400 font-bold hover:underline flex items-center gap-1">{parent.word}</button>
                                        </div>
                                    ) : (
                                        <span className="text-xs uppercase font-bold tracking-widest border border-neutral-700 px-1 rounded text-neutral-600">{t('lexicon.root') || 'Root'}</span>
                                    )}
                                    {descendants.length > 0 && (
                                        <>
                                            {parent && <span className="mx-2 text-neutral-700">|</span>}
                                            <div className="flex items-center gap-2 text-neutral-400">
                                                <GitFork size={12} />
                                                <span>{t('lexicon.descendants') || 'Descendants'}:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {descendants.map(desc => (
                                                        <button key={desc.id} onClick={() => jumpToWord(desc.word)} className="bg-neutral-800 hover:bg-neutral-700 text-blue-300 px-2 py-0.5 rounded text-xs transition-colors">{desc.word}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS: FIXED VISIBILITY */}
                    <div className="flex gap-2 items-start">
                        {/* Copy Text Button */}
                        <button
                            onClick={() => handleCopyText(entry)}
                            className="p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-colors relative border border-transparent hover:border-neutral-700"
                            title={t('lexicon.copy_latin') || "Copy Latin Text"}
                        >
                            {copiedId === `${entry.id}-text` ? <Check size={16} className="text-emerald-500" /> : <Type size={16} />}
                        </button>

                        {/* Copy Script Button (Only in Script Mode) */}
                        {isScriptMode && (
                            <button
                                onClick={() => handleCopyScript(entry)}
                                className="p-2 text-purple-400 hover:bg-purple-900/30 hover:text-purple-200 rounded-md transition-colors relative border border-transparent hover:border-purple-500/50"
                                title={t('lexicon.copy_native') || "Copy Native Script Symbols (PUA)"}
                            >
                                {copiedId === `${entry.id}-script` ? <Check size={16} className="text-emerald-500" /> : <Feather size={16} />}
                            </button>
                        )}

                        <button onClick={() => openEditModal(entry)} className="p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-colors" title={t('lexicon.edit')}>
                            <Edit size={16} />
                        </button>
                        <button onClick={(e) => requestDelete(entry, e)} className="p-2 text-red-400 hover:bg-red-950/30 rounded-md" title={t('common.delete')}><Trash2 size={16} /></button>
                    </div>
                </div>
            </div>
        );
    };

    const isSearchActive = debouncedSearchTerm.trim() !== '' || posFilter !== 'ALL';

    if (activeTab === 'GENERATE' && enableAI) {
        return (
            <div className="flex flex-col h-full bg-neutral-950">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between gap-4">
                    <button onClick={() => setActiveTab('BROWSE')} className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                        <ArrowRight className={direction === 'rtl' ? '' : 'rotate-180'} size={16} /> {t('common.cancel')}
                    </button>
                    {!isApiKeySet() && (
                        <div className="flex-1 bg-amber-950/20 border border-amber-900/50 rounded-lg p-2 text-xs text-amber-200 flex items-center gap-3">
                            <ShieldAlert size={14} className="shrink-0 text-amber-500" />
                            <p>{t('lexicon.ai_requires_key') || 'AI Generation requires an API Key.'} <a href="https://github.com/zRinexD/KoreLang/" target="_blank" rel="noopener noreferrer" className="underline font-bold">{t('lexicon.docs') || 'Documentation'}</a>.</p>
                        </div>
                    )}
                </div>
                <GenWord
                    onAddWords={handleBulkAdd}
                    onEditEntry={handleDraftEntry}
                    initialState={genWordState}
                    saveState={setGenWordState}
                    projectConstraints={constraints}
                    scriptConfig={scriptConfig}
                    isScriptMode={isScriptMode}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-neutral-950">
            <div className="flex flex-col border-b border-neutral-800 bg-neutral-900/50 sticky top-0 z-20 backdrop-blur-md">

                <div className="flex items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-2 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 -tranneutral-y-1/2 text-neutral-500" size={18} />
                            <input
                                type="text"
                                placeholder={t('lexicon.search')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 ps-10 pe-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-neutral-600 transition-all shadow-sm"
                            />
                            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute end-3 top-1/2 -tranneutral-y-1/2 text-neutral-500 hover:text-neutral-100"><X size={14} /></button>}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 rounded-lg border transition-colors flex items-center gap-2 ${showFilters || posFilter !== 'ALL' ? 'bg-blue-900/20 border-blue-600 text-blue-400' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'}`}
                            title={t('lexicon.filter_options')}
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                        {totalConflictCount > 0 && (
                            <button
                                onClick={toggleConflictMode}
                                className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 ${conflictMode !== 'HIDDEN' ? 'bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-900/30' : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:text-neutral-300'}`}
                                title={conflictMode === 'HIDDEN' ? t('lexicon.view_mode_pinned') : t('lexicon.view_mode_hide')}
                            >
                                {conflictMode === 'HIDDEN' ? <EyeOff size={18} /> : <Eye size={18} />}
                                {conflictMode !== 'HIDDEN' && <span className="font-mono text-xs font-bold">{totalConflictCount}</span>}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-neutral-500 text-sm font-mono hidden md:inline-block">
                            {isSearchActive ? `${searchResults.length} ${t('lexicon.results_count')}` : `${entries.length} ${t('lexicon.entries_count')}`}
                        </span>
                        {enableAI && (
                            <button onClick={() => setActiveTab('GENERATE')} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 px-3 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-purple-500/50">
                                <span className="text-lg font-mono">*</span><span className="hidden sm:inline">{t('lexicon.ai_gen_btn')}</span>
                            </button>
                        )}
                        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                            <Plus size={18} /><span className="hidden sm:inline">{t('lexicon.new')}</span>
                        </button>
                    </div>
                </div>
                {(showFilters || posFilter !== 'ALL') && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex flex-wrap items-center gap-4 shadow-inner">
                            <div className="flex items-center gap-2 border-r border-neutral-800 pr-4 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-4">
                                <Filter size={14} className="text-neutral-500" />
                                <span className="text-xs font-bold text-neutral-500 uppercase">{t('lexicon.pos')}:</span>
                                <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs rounded px-2 py-1 outline-none focus:border-blue-500">
                                    <option value="ALL">{t('val.any_pos') || 'Any POS'}</option>
                                    {POS_SUGGESTIONS.map(pos => <option key={pos} value={pos}>{getPosLabel(pos)}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-neutral-500 uppercase">{t('lexicon.search_in')}:</span>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white"><input type="checkbox" checked={searchFields.word} onChange={() => toggleField('word')} className="rounded border-neutral-700 bg-neutral-900 text-blue-600" />{t('lexicon.word')}</label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white"><input type="checkbox" checked={searchFields.definition} onChange={() => toggleField('definition')} className="rounded border-neutral-700 bg-neutral-900 text-blue-600" />{t('lexicon.definition')}</label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white"><input type="checkbox" checked={searchFields.etymology} onChange={() => toggleField('etymology')} className="rounded border-neutral-700 bg-neutral-900 text-blue-600" />{t('lexicon.etymology')}</label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white"><input type="checkbox" checked={searchFields.ipa} onChange={() => toggleField('ipa')} className="rounded border-neutral-700 bg-neutral-900 text-blue-600" />{t('lexicon.ipa')}</label>
                            </div>
                            <div className="ml-auto pl-4 border-l border-neutral-800 rtl:border-l-0 rtl:border-r rtl:ml-0 rtl:mr-auto rtl:pr-0 rtl:pl-4">
                                <select value={conflictMode} onChange={(e) => setConflictMode(e.target.value as ConflictViewMode)} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-400 outline-none focus:border-blue-500">
                                    <option value="PINNED">{t('lexicon.view_mode_pinned')}</option>
                                    <option value="HIDDEN">{t('lexicon.view_mode_hide')}</option>
                                    <option value="ONLY">{t('lexicon.view_mode_only')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {isSearchActive ? (
                        <div className="space-y-4">
                            {searchResults.length > 0 ? searchResults.map((entry) => renderEntryCard(entry)) : <div className="text-center py-20 text-neutral-600"><Search size={48} className="mx-auto mb-4 opacity-50" /><p className="text-lg">{t('lexicon.no_matches')}</p><p className="text-sm">{t('lexicon.try_adjust')}</p></div>}
                        </div>
                    ) : (
                        sortedKeys.length > 0 ? sortedKeys.map(letter => {
                            const isConflictGroup = letter === t('lexicon.conflicts_group');
                            return (
                                <div key={letter} className="space-y-4">
                                    <div className={`flex items-center gap-4 sticky top-0 backdrop-blur-sm z-10 py-2 ${isConflictGroup ? 'bg-neutral-950/95 text-red-400 border-b border-red-900/20' : 'bg-neutral-950/90'}`}>
                                        <h2 className={`text-4xl font-bold select-none flex items-center gap-3 ${isConflictGroup ? 'text-red-400 scale-90 origin-left rtl:origin-right' : 'text-neutral-100'}`}>
                                            {isConflictGroup && <AlertTriangle size={24} strokeWidth={2} />}
                                            {letter}
                                        </h2>
                                        <div className={`h-px flex-1 ${isConflictGroup ? 'bg-red-900/20' : 'bg-neutral-800'}`}></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedEntries[letter].map((entry) => renderEntryCard(entry))}
                                    </div>
                                </div>
                            );
                        }) : <div className="text-center py-20 text-neutral-600"><BookA size={48} className="mx-auto mb-4 opacity-50" /><p className="text-lg">{t('dashboard.empty_dict')}</p><p className="text-sm">{t('dashboard.create_first')}</p></div>
                    )}
                </div>
            </div>

            {entryToDelete && dependentsWarning.length > 0 && (
                <div className="fixed inset-0 bg-red-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
                    <div className="bg-neutral-900 border border-red-500/50 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-500/10 rounded-full shrink-0"><ShieldAlert className="text-red-500" size={32} /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-50 mb-2">{t('integrity.title')}</h3>
                                    <p className="text-neutral-300 mb-4">{t('integrity.warning')}</p>
                                    <div className="bg-neutral-950 rounded border border-red-900/30 p-3 mb-4 max-h-40 overflow-y-auto">
                                        <div className="text-xs font-bold text-red-400 uppercase mb-2">Dependents:</div>
                                        <ul className="space-y-1">{dependentsWarning.map(d => <li key={d.id} className="text-sm text-neutral-400 flex items-center gap-2"><ArrowRight className={direction === 'rtl' ? 'rotate-180' : ''} size={12} /> {d.word}</li>)}</ul>
                                    </div>
                                    <p className="text-xs text-neutral-500 italic mb-6">{t('integrity.desc')}</p>
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={cancelDelete} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded font-medium transition-colors">{t('integrity.action_cancel')}</button>
                                        <button onClick={performUnlinkAndDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2"><AlertTriangle size={16} />{t('integrity.action_unlink')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSimpleDeleteConfirm && entryToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
                    <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-neutral-800 rounded-full shrink-0"><HelpCircle className="text-neutral-400" size={32} /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-50 mb-2">{t('lexicon.delete_confirm_title')}</h3>
                                    <p className="text-neutral-300 mb-6">{t('lexicon.delete_confirm_desc')} <span className="font-bold text-neutral-100">"{entryToDelete.word}"</span>? {t('lexicon.action_cannot_undo')}</p>
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={cancelDelete} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded font-medium transition-colors">{t('common.cancel')}</button>
                                        <button onClick={confirmSimpleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors shadow-lg shadow-red-900/20">{t('common.delete')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    {/* FLOATING IPA KEYBOARD - OMNIPRESENT */}
                    {(showIPAKeyboard || pinIPAKeyboard) && (
                        <div className={`absolute z-[120] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${pinIPAKeyboard ? 'right-4 top-20 bottom-20 w-64' : 'bottom-10 left-1/2 -tranneutral-x-1/2 w-[600px] h-[300px]'}`}>
                            <div className="flex items-center justify-between p-2 bg-neutral-800 border-b border-neutral-700 cursor-move">
                                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                    <Mic size={12} /> IPA Keyboard
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setPinIPAKeyboard(!pinIPAKeyboard)}
                                        className={`p-1 rounded hover:bg-neutral-700 ${pinIPAKeyboard ? 'text-blue-400' : 'text-neutral-500'}`}
                                        title="Pin Panel"
                                    >
                                        {pinIPAKeyboard ? <PinOff size={12} /> : <Pin size={12} />}
                                    </button>
                                    <button onClick={() => { setShowIPAKeyboard(false); setPinIPAKeyboard(false); }} className="p-1 text-neutral-500 hover:text-white">
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 bg-neutral-950 custom-scrollbar">
                                {Object.entries(IPA_SYMBOLS).map(([category, symbols]) => (
                                    <div key={category} className="mb-4">
                                        <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">{category}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {symbols.map(char => (
                                                <button
                                                    key={char}
                                                    onClick={() => handleIPAInsert(char)}
                                                    className="w-8 h-8 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 hover:border-neutral-600 font-serif text-lg transition-colors"
                                                >
                                                    {char}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
                            <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                                {editingEntryId ? <Edit size={18} className="text-blue-500" /> : <Plus size={18} className="text-blue-500" />}
                                {editingEntryId ? t('lexicon.edit') : t('lexicon.new')}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            {validationErrors.length > 0 && (
                                <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-3 flex items-start gap-3">
                                    <AlertOctagon className="text-red-500 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <div className="text-xs font-bold text-red-400 uppercase mb-1">{t('val.errors_title')}</div>
                                        <ul className="text-sm text-red-200 list-disc list-inside">{validationErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-neutral-400 uppercase">{t('lexicon.word')}</label>
                                    <input autoFocus value={newWord} onChange={(e) => setNewWord(e.target.value)} className={`w-full bg-neutral-950 border rounded p-2 text-neutral-100 focus:outline-none focus:ring-1 ${validationErrors.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="e.g. kamra" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-neutral-400 uppercase">{t('lexicon.ipa')}</label>
                                    <div className="relative">
                                        <input
                                            value={newIPA}
                                            onChange={(e) => setNewIPA(e.target.value)}
                                            onFocus={() => setShowIPAKeyboard(true)}
                                            // On blur we might want to hide, but if pinned, keep it. 
                                            // Also need to check if focus moved TO the keyboard.
                                            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-100 font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="e.g. ˈkam.ra"
                                        />
                                        <button onClick={() => setShowIPAKeyboard(!showIPAKeyboard)} className="absolute right-2 top-1/2 -tranneutral-y-1/2 text-neutral-500 hover:text-blue-400">
                                            <Mic size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-400 uppercase">{t('lexicon.pos')}</label>
                                <Combobox value={newPOS} onChange={setNewPOS} options={POS_SUGGESTIONS} placeholder={t('lexicon.pos_placeholder') || 'Select POS...'} renderOption={(opt) => getPosLabel(opt)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-400 uppercase">{t('lexicon.definition')}</label>
                                <textarea value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-100 h-24 focus:border-blue-500 focus:outline-none resize-none focus:ring-1 focus:ring-blue-500" placeholder="..." />
                            </div>
                            <div className="border-t border-neutral-800 pt-4 mt-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase mb-3 block flex items-center gap-2"><GitFork size={12} /> {t('lexicon.etymology')}</label>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-neutral-500 uppercase">{t('lexicon.derivedFrom')}</label>
                                        <select value={newDerivedFrom} onChange={(e) => setNewDerivedFrom(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-300 focus:border-blue-500 focus:outline-none">
                                            <option value="">{t('lexicon.root_option') || '-- Root --'}</option>
                                            {entries.sort((a, b) => a.word.localeCompare(b.word)).map(e => <option key={e.id} value={e.id}>{e.word} ({getPosLabel(e.pos)})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-neutral-500 uppercase">{t('lexicon.etymology')}</label>
                                        <input value={newEtymology} onChange={(e) => setNewEtymology(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-neutral-100 focus:border-blue-500 focus:outline-none" placeholder="e.g. Borrowed from High Valyrian..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-300 hover:text-white text-sm font-medium transition-colors">{t('lexicon.cancel')}</button>
                            <button onClick={handleSaveEntry} disabled={validationErrors.length > 0} className={`px-4 py-2 text-white text-sm font-medium rounded-md shadow-lg transition-all active:scale-95 ${validationErrors.length > 0 ? 'bg-neutral-700 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'}`}>{t('lexicon.save')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lexicon;