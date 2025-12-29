import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, BookA, GitFork, ArrowRight, Link, Filter, X, SlidersHorizontal, ShieldAlert, AlertTriangle, HelpCircle, AlertOctagon, Edit, Ban, Eye, EyeOff, Copy, Check, Feather, Type, Mic, Pin, PinOff, Wand2 } from 'lucide-react';
import { LexiconEntry, POS_SUGGESTIONS, ProjectConstraints, PhonologyConfig, ScriptConfig } from '../types';
import Combobox from './Combobox';
import GenWord from './GenWord';
import { ConScriptText } from './ConScriptRenderer';
import { useTranslation } from '../i18n';
import { searchLexicon, SearchResult } from '../services/searchService';
import { isApiKeySet } from '../services/geminiService';
import { ViewLayout, CompactButton, StatBadge } from './ui';
import LexiconLetterIndicator from './LexiconLetterIndicator';

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
    // Entry click copy feedback (border flash + animation + success message)
    const [copyFlashId, setCopyFlashId] = useState<string | null>(null);
    const [clickAnimId, setClickAnimId] = useState<string | null>(null);
    const [successMsgId, setSuccessMsgId] = useState<string | null>(null);

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

    // Scroll to the group for the clicked letter (preserves layout; no visual changes)
    const scrollToLetter = useCallback((letter: string) => {
        try {
            const groupEl = document.querySelector(`[data-letter="${CSS.escape(letter)}"]`);
            if (groupEl && 'scrollIntoView' in groupEl) {
                (groupEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch {}
    }, []);

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

            copyTextSafe(textToCopy).then((ok) => {
                if (ok) {
                    setCopiedId(`${entry.id}-script`);
                    setTimeout(() => setCopiedId(null), 2000);
                }
            });
        }
    };

    // Safe clipboard helper with fallback
    const copyTextSafe = async (text: string): Promise<boolean> => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (_) {}
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (_) {
            return false;
        }
    };

    // Click-to-copy on entry card with success flash + bubble tip
    const handleCardCopy = (entry: LexiconEntry, e: React.MouseEvent<HTMLDivElement>) => {
        setClickAnimId(entry.id);
        setTimeout(() => setClickAnimId(null), 150);
        copyTextSafe(entry.word).then(() => {
            setCopyFlashId(entry.id);
            setSuccessMsgId(entry.id);
            setTimeout(() => setCopyFlashId(null), 600);
            setTimeout(() => setSuccessMsgId(null), 1500);
        });
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
            <div
                key={entry.id}
                onClick={(e) => handleCardCopy(entry, e)}
                className="p-4 cursor-pointer transition-all group relative overflow-hidden rounded-lg border border-[var(--border)] hover:border-[var(--accent)]"
                style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: isInvalid ? 'var(--error)' : (successMsgId === entry.id || copyFlashId === entry.id ? 'var(--success)' : undefined),
                    transform: clickAnimId === entry.id ? 'scale(0.98)' : 'scale(1)',
                    transition: 'transform 0.15s ease, border-color 0.5s ease-out'
                }}
            >
                {entry.derivedFrom && <GitFork className={`absolute ${direction === 'rtl' ? '-left-4 -scale-x-100' : '-right-4'} -top-4 text-neutral-800 opacity-20 w-32 h-32 rotate-12`} />}

                {/* ACTION BUTTONS fading in (no container background) */}
                <div className="absolute top-0 right-0 flex transition-opacity opacity-0 group-hover:opacity-100">
                    <button
                        onClick={(ev) => { ev.stopPropagation(); openEditModal(entry); }}
                        className="px-2 py-2 transition-colors rounded-bl-lg"
                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.85)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                        title={t('lexicon.edit')}
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); requestDelete(entry, e); }}
                        className="px-2 py-2 transition-colors rounded-tr-lg"
                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.85)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                        title={t('common.delete')}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-3 mb-1">
                            {/* OMNI-GLYPH LOGIC */}
                            {isScriptMode ? (
                                <div className="flex flex-col">
                                    <div className="mb-1 text-4xl leading-none" style={{ color: 'var(--accent)' }}>
                                        <ConScriptText text={entry.word} scriptConfig={scriptConfig} />
                                    </div>
                                    <span className="font-mono text-xs text-neutral-500">{entry.word}</span>
                                </div>
                            ) : (
                                <h3 className="font-serif text-2xl font-bold text-neutral-100">{entry.word}</h3>
                            )}

                            <span className="text-neutral-300 font-mono text-sm px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--border)' }}>/{entry.ipa}/</span>
                            <span className="font-sans text-blue-400 text-xs uppercase font-bold tracking-wider border border-blue-900 bg-blue-950/30 px-1.5 rounded">{getPosLabel(entry.pos)}</span>
                            {isInvalid && (
                                <div className="relative group/badge">
                                    <span className="flex items-center gap-1 text-red-400 text-[9px] uppercase font-bold tracking-wider border border-dashed border-red-500/30 bg-red-950/20 px-1 rounded cursor-help">
                                        <Ban size={8} /> {t('lexicon.non_canon')}
                                    </span>
                                    <div className="absolute left-0 z-50 hidden p-2 mb-2 text-xs border rounded shadow-xl bottom-full group-hover/badge:block bg-neutral-900 text-neutral-300 border-neutral-700 whitespace-nowrap">
                                        <div className="flex items-center gap-1 mb-1 font-bold text-neutral-100"><AlertTriangle size={10} className="text-red-400" /> {t('val.errors_title')}</div>
                                        {entryErrors.map((e, i) => <div key={i} className="flex items-center gap-1 text-[10px]"><span className="w-0.5 h-0.5 bg-red-400 rounded-full flex-shrink-0"></span><span>{e}</span></div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="mb-2 text-sm text-neutral-500">{entry.definition}</p>

                        {(parent || descendants.length > 0 || entry.etymology) && (
                            <div className="p-3 space-y-2 border rounded-md" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--divider)' }}>
                                {entry.etymology && <div className="mb-1 text-sm italic" style={{ color: 'var(--text-secondary)' }}>"{ entry.etymology}"</div>}
                                <div className="flex flex-wrap items-center text-sm gap-y-2">
                                    {parent ? (
                                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                            <Link size={12} />
                                            <span>{t('lexicon.derived_from') || 'Derived From'}:</span>
                                            <button onClick={() => jumpToWord(parent.word)} className="flex items-center gap-1 font-bold hover:underline" style={{ color: 'var(--accent)' }}>{parent.word}</button>
                                        </div>
                                    ) : (
                                        <span className="px-1 text-xs font-bold tracking-widest uppercase border rounded" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>{t('lexicon.root') || 'Root'}</span>
                                    )}
                                    {descendants.length > 0 && (
                                        <>
                                            {parent && <span className="mx-2" style={{ color: 'var(--divider)' }}>|</span>}
                                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                                <GitFork size={12} />
                                                <span>{t('lexicon.descendants') || 'Descendants'}:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {descendants.map(desc => (
                                                        <button key={desc.id} onClick={() => jumpToWord(desc.word)} className="px-2 py-0.5 rounded text-xs transition-colors" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', border: '1px solid', color: 'var(--accent)' }}>{desc.word}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success message on copy with neon glow and blink */}
                {successMsgId === entry.id && (
                    <div
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 text-sm font-medium pointer-events-none animate-in fade-in duration-200 z-50"
                        style={{
                            color: 'var(--success)',
                            textShadow: '0 0 8px var(--success), 0 0 16px var(--success)',
                            animation: successMsgId === entry.id ? 'blinkFadeOut 1.5s ease-in-out forwards' : 'none',
                            fontWeight: 600,
                            zIndex: 100
                        }}
                    >
                        <span>{t('common.copied') || 'Copy'}</span>
                        <Check size={16} style={{ filter: 'drop-shadow(0 0 4px var(--success))' }} />
                    </div>
                )}
            </div>
        );
    };

    const isSearchActive = debouncedSearchTerm.trim() !== '' || posFilter !== 'ALL';

    const headerActions = (
        <div className="flex items-center w-full gap-3">
            <div className="flex items-center flex-1 max-w-2xl gap-2">
                <div className="relative flex-1">
                    <Search className="absolute -translate-y-1/2 start-3 top-1/2" size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder={t('lexicon.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full ps-10 pe-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:[color:var(--disabled)]"
                        style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: `1px solid var(--border)`, outline: 'none', caretColor: 'var(--accent)' }}
                    />
                    {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute -translate-y-1/2 end-3 top-1/2" style={{ color: 'var(--text-secondary)' }}><X size={14} /></button>}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center p-2 transition-colors border rounded-md"
                    style={showFilters || posFilter !== 'ALL'
                        ? { backgroundColor: 'var(--elevated)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                        : { backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    title={t('lexicon.filter_options')}
                >
                    <SlidersHorizontal size={16} />
                </button>
                {totalConflictCount > 0 && (
                    <button
                        onClick={toggleConflictMode}
                        className="p-2.5 rounded-lg border transition-all flex items-center gap-2"
                        style={conflictMode !== 'HIDDEN'
                            ? { backgroundColor: 'rgb(from var(--error) r g b / 0.15)', borderColor: 'var(--error)', color: 'var(--error)' }
                            : { backgroundColor: 'var(--surface)', borderColor: 'var(--divider)', color: 'var(--text-secondary)' }}
                        title={conflictMode === 'HIDDEN' ? t('lexicon.view_mode_pinned') : t('lexicon.view_mode_hide')}
                    >
                        {conflictMode === 'HIDDEN' ? <EyeOff size={18} /> : <Eye size={18} />}
                        {conflictMode !== 'HIDDEN' && <span className="font-mono text-xs font-bold">{totalConflictCount}</span>}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4">
                <StatBadge
                    value={entries.length}
                    label={"words"}
                    className="hidden md:flex"
                />
                {enableAI && (
                    <CompactButton
                        onClick={() => setActiveTab('GENERATE')}
                        variant="solid"
                        color="var(--accent)"
                        icon={<Wand2 size={14} />}
                        label={t('lexicon.ai_gen_btn')}
                    />
                )}
                <CompactButton
                    onClick={openAddModal}
                    variant="solid"
                    color="var(--accent)"
                    icon={<Plus size={16} />}
                    label={t('lexicon.new')}
                />
            </div>
        </div>
    );

    const generateHeaderActions = (
        <div className="flex items-center gap-3">
            {!isApiKeySet() && (
                <div className="hidden md:flex items-center flex-1 gap-3 p-2 text-xs border rounded-lg bg-amber-950/20 border-amber-900/50 text-amber-200">
                    <ShieldAlert size={14} className="shrink-0 text-amber-500" />
                    <p>{t('lexicon.ai_requires_key') || 'AI Generation requires an API Key.'} <a href="https://github.com/zRinexD/KoreLang/" target="_blank" rel="noopener noreferrer" className="font-bold underline">{t('lexicon.docs') || 'Documentation'}</a>.</p>
                </div>
            )}
            <button
                onClick={() => setActiveTab('BROWSE')}
                className="flex items-center gap-2 text-sm font-bold text-neutral-400"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
                <ArrowRight className={direction === 'rtl' ? '' : 'rotate-180'} size={16} /> {t('common.cancel')}
            </button>
        </div>
    );

    if (activeTab === 'GENERATE' && enableAI) {
        return (
            <ViewLayout
                icon={BookA}
                title={t('nav.lexicon')}
                subtitle={t('lexicon.ai_gen_btn')}
                headerChildren={generateHeaderActions}
            >
                <GenWord
                    onAddWords={handleBulkAdd}
                    onEditEntry={handleDraftEntry}
                    initialState={genWordState}
                    saveState={setGenWordState}
                    projectConstraints={constraints}
                    scriptConfig={scriptConfig}
                    isScriptMode={isScriptMode}
                    phonology={phonology}
                />
            </ViewLayout>
        );
    }

    return (
        <ViewLayout
            icon={BookA}
            title={t('nav.lexicon')}
            subtitle={t('lexicon.search')}
            headerChildren={headerActions}
        >
            {(showFilters || posFilter !== 'ALL') && (
                <div className="sticky flex justify-start pb-0" style={{ top: 0, left: 0, right: 0, zIndex: 45 }}>
                    <div className="w-full flex flex-wrap items-center gap-3 p-2 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2 pr-4 border-r rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-4" style={{ borderColor: 'var(--divider)' }}>
                            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
                            <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} className="px-2 py-1 text-xs border rounded outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)', outlineColor: 'var(--accent)' }}>
                                <option value="ALL">{t('lexicon.all_types')}</option>
                                {POS_SUGGESTIONS.map(pos => <option key={pos} value={pos}>{getPosLabel(pos)}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('lexicon.search_in')}:</span>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}><input type="checkbox" checked={searchFields.word} onChange={() => toggleField('word')} className="rounded" style={{ borderColor: 'var(--border)' }} />{t('lexicon.word')}</label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}><input type="checkbox" checked={searchFields.definition} onChange={() => toggleField('definition')} className="rounded" style={{ borderColor: 'var(--border)' }} />{t('lexicon.definition')}</label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}><input type="checkbox" checked={searchFields.etymology} onChange={() => toggleField('etymology')} className="rounded" style={{ borderColor: 'var(--border)' }} />{t('lexicon.etymology')}</label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}><input type="checkbox" checked={searchFields.ipa} onChange={() => toggleField('ipa')} className="rounded" style={{ borderColor: 'var(--border)' }} />{t('lexicon.ipa')}</label>
                        </div>
                        <div className="pl-4 ml-auto border-l rtl:border-l-0 rtl:border-r rtl:ml-0 rtl:mr-auto rtl:pr-0 rtl:pl-4" style={{ borderColor: 'var(--divider)' }}>
                            <select value={conflictMode} onChange={(e) => setConflictMode(e.target.value as ConflictViewMode)} className="px-2 py-1 text-xs border rounded outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)', caretColor: 'var(--accent)' }}>
                                <option value="PINNED">{t('lexicon.view_mode_pinned')}</option>
                                <option value="HIDDEN">{t('lexicon.view_mode_hide')}</option>
                                <option value="ONLY">{t('lexicon.view_mode_only')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex flex-col">
                <div className="px-6 py-4 space-y-3">
                    {isSearchActive ? (
                        <div className="space-y-2">
                            {searchResults.length > 0 ? searchResults.map((entry) => renderEntryCard(entry)) : <div className="py-20 text-center text-neutral-600"><Search size={40} className="mx-auto mb-4 opacity-50" /><p className="text-sm">{t('lexicon.no_matches')}</p><p className="text-xs">{t('lexicon.try_adjust')}</p></div>}
                        </div>
                    ) : (
                        sortedKeys.length > 0 ? sortedKeys.map(letter => {
                            const isConflictGroup = letter === t('lexicon.conflicts_group');
                            const groupCount = groupedEntries[letter]?.length || 0;
                            return (
                                <div key={letter} className="space-y-3" data-letter={letter}>
                                    <div className="sticky flex justify-start" style={{ top: '40px', left: 0, marginLeft: '-24px', zIndex: 50 }}>
                                        <LexiconLetterIndicator
                                            letter={letter}
                                            count={groupCount}
                                            isConflictGroup={isConflictGroup}
                                            onClick={() => scrollToLetter(letter)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 mt-2">
                                        {groupedEntries[letter].map((entry) => renderEntryCard(entry))}
                                    </div>
                                </div>
                            );
                        }) : <div className="py-20 text-center text-neutral-600"><BookA size={48} className="mx-auto mb-4 opacity-50" /><p className="text-lg">{t('dashboard.empty_dict')}</p><p className="text-sm">{t('dashboard.create_first')}</p></div>
                    )}
                </div>
            </div>

            {entryToDelete && dependentsWarning.length > 0 && (
                <div className="fixed inset-0 bg-[rgb(from var(--background) r g b / 0.6)] backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
                    <div className="w-full max-w-lg overflow-hidden duration-200 border shadow-2xl rounded-xl animate-in fade-in zoom-in" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--error)' }}>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full shrink-0" style={{ backgroundColor: 'rgb(from var(--error) r g b / 0.15)' }}><ShieldAlert style={{ color: 'var(--error)' }} size={32} /></div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('integrity.title')}</h3>
                                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{t('integrity.warning')}</p>
                                    <div className="p-3 mb-4 overflow-y-auto border rounded max-h-40" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--error)' }}>
                                        <div className="mb-2 text-xs font-bold uppercase" style={{ color: 'var(--error)' }}>{t('lexicon.dependents_label')}</div>
                                        <ul className="space-y-1">{dependentsWarning.map(d => <li key={d.id} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}><ArrowRight className={direction === 'rtl' ? 'rotate-180' : ''} size={12} /> {d.word}</li>)}</ul>
                                    </div>
                                    <p className="mb-6 text-xs italic" style={{ color: 'var(--text-tertiary)' }}>{t('integrity.desc')}</p>
                                    <div className="flex justify-end gap-3">
                                        <button onClick={cancelDelete} className="px-4 py-2 font-medium transition-colors rounded" style={{ backgroundColor: 'var(--elevated)', color: 'var(--text-primary)' }}>{t('integrity.action_cancel')}</button>
                                        <button onClick={performUnlinkAndDelete} className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors rounded shadow-lg" style={{ backgroundColor: 'var(--error)' }}><AlertTriangle size={16} />{t('integrity.action_unlink')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSimpleDeleteConfirm && entryToDelete && (
                <div className="fixed inset-0 bg-[rgb(from var(--background) r g b / 0.6)] backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
                    <div className="w-full max-w-md duration-200 border shadow-2xl rounded-xl animate-in fade-in zoom-in" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full shrink-0" style={{ backgroundColor: 'var(--elevated)' }}><HelpCircle style={{ color: 'var(--text-secondary)' }} size={32} /></div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('lexicon.delete_confirm_title')}</h3>
                                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{t('lexicon.delete_confirm_desc')} <span className="font-bold" style={{ color: 'var(--text-primary)' }}>"{entryToDelete.word}"</span>? {t('lexicon.action_cannot_undo')}</p>
                                    <div className="flex justify-end gap-3">
                                        <button onClick={cancelDelete} className="px-4 py-2 font-medium transition-colors rounded" style={{ backgroundColor: 'var(--elevated)', color: 'var(--text-primary)' }}>{t('common.cancel')}</button>
                                        <button onClick={confirmSimpleDelete} className="px-4 py-2 font-medium text-white transition-colors rounded shadow-lg" style={{ backgroundColor: 'var(--error)' }}>{t('common.delete')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgb(from var(--background) r g b / 0.7)] backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    {/* FLOATING IPA KEYBOARD - OMNIPRESENT */}
                    {(showIPAKeyboard || pinIPAKeyboard) && (
                        <div className={`absolute z-[120] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${pinIPAKeyboard ? 'right-4 top-20 bottom-20 w-64' : 'bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px]'}`} style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
                            <div className="flex items-center justify-between p-2 border-b cursor-move" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                                <span className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
                                    <Mic size={12} /> {t('lexicon.ipa_keyboard')}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setPinIPAKeyboard(!pinIPAKeyboard)}
                                        className="p-1 rounded transition-colors"
                                        style={{ color: pinIPAKeyboard ? 'var(--accent)' : 'var(--text-tertiary)' }}
                                        title={t('lexicon.pin_panel')}
                                    >
                                        {pinIPAKeyboard ? <PinOff size={12} /> : <Pin size={12} />}
                                    </button>
                                    <button onClick={() => { setShowIPAKeyboard(false); setPinIPAKeyboard(false); }} className="p-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--background)' }}>
                                {Object.entries(IPA_SYMBOLS).map(([category, symbols]) => (
                                    <div key={category} className="mb-4">
                                        <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>{category}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {symbols.map(char => (
                                                <button
                                                    key={char}
                                                    onClick={() => handleIPAInsert(char)}
                                                    className="flex items-center justify-center w-8 h-8 font-serif text-lg transition-colors border rounded hover:brightness-110"
                                                    style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
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
                        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                            <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                {editingEntryId ? <Edit size={18} style={{ color: 'var(--accent)' }} /> : <Plus size={18} style={{ color: 'var(--accent)' }} />}
                                {editingEntryId ? t('lexicon.edit') : t('lexicon.new')}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="transition-colors" style={{ color: 'var(--text-secondary)' }}>✕</button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto" style={{ backgroundColor: 'var(--surface)' }}>
                            {validationErrors.length > 0 && (
                                <div className="flex items-start gap-3 p-3 border rounded-lg" style={{ backgroundColor: 'rgb(from var(--error) r g b / 0.15)', borderColor: 'var(--error)' }}>
                                    <AlertOctagon style={{ color: 'var(--error)' }} className="shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--error)' }}>{t('val.errors_title')}</div>
                                        <ul className="text-sm list-disc list-inside" style={{ color: 'var(--error)' }}>{validationErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>{t('lexicon.word')}</label>
                                    <input autoFocus value={newWord} onChange={(e) => setNewWord(e.target.value)} className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: validationErrors.length > 0 ? 'var(--error)' : 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }} placeholder={t('lexicon.word_placeholder')} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>{t('lexicon.ipa')}</label>
                                    <div className="relative">
                                        <input
                                            value={newIPA}
                                            onChange={(e) => setNewIPA(e.target.value)}
                                            onFocus={() => setShowIPAKeyboard(true)}
                                            className="w-full p-2 font-mono border rounded text-sm focus:outline-none focus:ring-1"
                                            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
                                            placeholder={t('lexicon.ipa_placeholder')}
                                        />
                                        <button onClick={() => setShowIPAKeyboard(!showIPAKeyboard)} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                                            <Mic size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>{t('lexicon.pos')}</label>
                                <Combobox value={newPOS} onChange={setNewPOS} options={POS_SUGGESTIONS} placeholder={t('lexicon.pos_placeholder') || 'Select POS...'} renderOption={(opt) => getPosLabel(opt)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>{t('lexicon.definition')}</label>
                                <textarea value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} className="w-full h-24 p-2 border rounded resize-none text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }} placeholder="..." />
                            </div>
                            <div className="pt-4 mt-2 border-t" style={{ borderColor: 'var(--divider)' }}>
                                <label className="flex items-center gap-2 mb-3 text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}><GitFork size={12} /> {t('lexicon.etymology')}</label>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('lexicon.derivedFrom')}</label>
                                        <select value={newDerivedFrom} onChange={(e) => setNewDerivedFrom(e.target.value)} className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }}>
                                            <option value="">{t('lexicon.root_option') || '-- Root --'}</option>
                                            {entries.sort((a, b) => a.word.localeCompare(b.word)).map(e => <option key={e.id} value={e.id}>{e.word} ({getPosLabel(e.pos)})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('lexicon.etymology')}</label>
                                        <input value={newEtymology} onChange={(e) => setNewEtymology(e.target.value)} className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', caretColor: 'var(--accent)' }} placeholder={t('lexicon.etymology_placeholder')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                            <CompactButton
                                onClick={() => setIsModalOpen(false)}
                                variant="outline"
                                color="var(--error)"
                                icon={<X size={12} />}
                                label={t('lexicon.cancel')}
                            />
                            <CompactButton
                                onClick={handleSaveEntry}
                                disabled={validationErrors.length > 0}
                                variant="solid"
                                color="var(--accent)"
                                icon={<Check size={16} />}
                                label={t('lexicon.save')}
                            />
                        </div>
                    </div>
                </div>
            )}
        </ViewLayout>
    );
};

export default Lexicon;