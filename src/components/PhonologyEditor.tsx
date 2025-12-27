import React, { useState } from 'react';
import { Wand2, RefreshCw, Volume2, Info, LayoutGrid, EyeOff, ShieldAlert, Plus, Trash2, X, Check, Eye, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { generatePhonology, isApiKeySet } from '../services/geminiService';
import { PhonologyConfig, Phoneme } from '../types';
import { useTranslation } from '../i18n';

interface PhonologyEditorProps {
    data: PhonologyConfig;
    setData: (data: PhonologyConfig) => void;
    enableAI: boolean; // NEW PROP
}

const MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral-fricative', 'approximant', 'lateral-approximant'];
const PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
const HEIGHTS = ['close', 'near-close', 'close-mid', 'mid', 'open-mid', 'near-open', 'open'];
const BACKNESS = ['front', 'central', 'back'];

const PhonologyEditor: React.FC<PhonologyEditorProps> = ({ data, setData, enableAI }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingPhonology, setPendingPhonology] = useState<PhonologyConfig | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isPreviewMinimized, setIsPreviewMinimized] = useState(false);
    const [editingPhoneme, setEditingPhoneme] = useState<{ type: 'consonant' | 'vowel', manner?: string, place?: string, height?: string, backness?: string } | null>(null);
    const [symbol, setSymbol] = useState('');
    const [voiced, setVoiced] = useState(false);
    const [rounded, setRounded] = useState(false);

    // Classified vs unclassified phonemes (useful when AI returns symbols without full features)
    const classifiedConsonants = (data.consonants || []).filter(p => p.manner && p.place);
    const unclassifiedConsonants = (data.consonants || []).filter(p => !(p.manner && p.place));

    const classifiedVowels = (data.vowels || []).filter(v => v.height && v.backness);
    const unclassifiedVowels = (data.vowels || []).filter(v => !(v.height && v.backness));

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const result = await generatePhonology(prompt);
            console.log('AI generatePhonology result:', result);
            setPendingPhonology(result);
            setShowPreview(true);
            setIsPreviewMinimized(false);
        } catch (e) {
            alert(t('phonology.generation_failed'));
        }
        setLoading(false);
    };

    const confirmReplace = () => {
        if (!pendingPhonology) return;
        // Check if there was previous phonology to warn user
        const hasPrevious = data.consonants.length > 0 || data.vowels.length > 0;
        if (hasPrevious) {
            if (!confirm(t('phonology.replace_confirm'))) return;
        }
        setData(pendingPhonology);
        setPendingPhonology(null);
        setShowPreview(false);
    };

    const discardPending = () => {
        setPendingPhonology(null);
        setShowPreview(false);
    };

    const handleSavePhoneme = () => {
        if (!symbol || !editingPhoneme) return;

        const newPhoneme: Phoneme = {
            symbol,
            type: editingPhoneme.type,
            ...(editingPhoneme.type === 'consonant' ? { manner: editingPhoneme.manner, place: editingPhoneme.place, voiced } : { height: editingPhoneme.height, backness: editingPhoneme.backness, rounded })
        };

        const listKey = editingPhoneme.type === 'consonant' ? 'consonants' : 'vowels';
        const updatedList = [...(data[listKey] || [])];

        // Remove existing phoneme with same symbol or in same cell if we want unique symbols
        // For now, let's just add it.
        updatedList.push(newPhoneme);

        setData({
            ...data,
            [listKey]: updatedList
        });
        setEditingPhoneme(null);
        setSymbol('');
    };

    const handleRemovePhoneme = (idx: number, type: 'consonant' | 'vowel') => {
        const listKey = type === 'consonant' ? 'consonants' : 'vowels';
        const updatedList = [...(data[listKey] || [])];
        updatedList.splice(idx, 1);
        setData({ ...data, [listKey]: updatedList });
    };

    const clearAll = () => {
        if (confirm(t('phonology.clear_confirm'))) {
            setData({ ...data, consonants: [], vowels: [] });
        }
    };

    // Helper to find phoneme in specific cell using normalized matching
    const normalize = (s?: string) => (s || '').toString().toLowerCase().trim();

    const getConsonants = (manner: string, place: string) => {
        const nm = normalize(manner);
        const np = normalize(place);
        return classifiedConsonants.filter(p => normalize(p.manner) === nm && normalize(p.place) === np);
    };

    const getVowels = (height: string, backness: string) => {
        const nh = normalize(height);
        const nb = normalize(backness);
        return classifiedVowels.filter(p => normalize(p.height) === nh && normalize(p.backness) === nb);
    };

    return (
        <div className="flex h-full bg-neutral-900 gap-6 p-6 overflow-hidden">

            {/* Left Panel: Controls */}
            <div className="w-80 flex flex-col gap-6 shrink-0">

                {/* AI GENERATOR PANEL (Conditional) */}
                {enableAI ? (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg">
                        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2 mb-4">
                            <Wand2 className="text-purple-500" size={20} />
                            {t('phonology.ai_generator')}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">{t('phonology.vibe_label')}</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={t('phonology.vibe_placeholder')}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm text-neutral-200 focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none placeholder-neutral-600"
                                />
                                {!isApiKeySet() && (
                                    <div className="mt-3 p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg text-[11px] text-amber-200 flex items-start gap-3">
                                        <ShieldAlert size={14} className="shrink-0 text-amber-500" />
                                        <div>
                                            {t('console.ai_failed_no_key')} <a href="https://github.com/zRinexD/KoreLang/" target="_blank" rel="noopener noreferrer" className="underline font-bold">{t('menu.docs')}</a>.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : <Wand2 size={18} />}
                                {loading ? t('phonology.analyze_btn') : t('phonology.generate_btn')}
                            </button>
                            {pendingPhonology && (
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="w-full mt-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all border border-neutral-700"
                                >
                                    <Eye size={16} />
                                    {showPreview ? t('phonology.hide_preview') : t('phonology.show_preview')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center opacity-50">
                        <EyeOff size={32} className="mb-2 text-neutral-500" />
                        <h3 className="font-bold text-neutral-300">{t('phonology.ai_disabled_title')}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{t('phonology.ai_disabled_desc')}</p>
                    </div>
                )}

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg flex-1 overflow-y-auto">
                    <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2 mb-4">
                        <Info className="text-blue-500" size={20} />
                        {t('phonology.stats')}
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-neutral-800 pb-2">
                            <span className="text-neutral-400">{t('phonology.inventory')}</span>
                            <span className="text-neutral-200 font-mono">{(data.consonants?.length || 0) + (data.vowels?.length || 0)}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-800 pb-2">
                            <span className="text-neutral-400">{t('phonology.consonants')}</span>
                            <span className="text-neutral-200 font-mono">{data.consonants?.length || 0}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-800 pb-2">
                            <span className="text-neutral-400">{t('phonology.vowels')}</span>
                            <span className="text-neutral-200 font-mono">{data.vowels?.length || 0}</span>
                        </div>
                        <div>
                            <span className="text-neutral-400 block mb-1">{t('phonology.syllable_struct')}</span>
                            <input
                                value={data.syllableStructure || ''}
                                onChange={(e) => setData({ ...data, syllableStructure: e.target.value })}
                                placeholder={t('phonology.syllable_placeholder')}
                                className="w-full bg-neutral-900 px-2 py-1 rounded text-emerald-400 font-mono text-xs border border-neutral-800 outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <button
                            onClick={clearAll}
                            className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-400 border border-red-900/30 py-2 rounded transition-colors"
                        >
                            <Trash2 size={12} /> {t('phonology.clear_inventory')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Charts */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">

                {/* Consonants Chart */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-lg overflow-x-auto">
                    <h3 className="text-lg font-bold text-neutral-200 mb-6 flex items-center gap-2">
                        <LayoutGrid size={20} className="text-neutral-500" /> {t('phonology.consonants')}
                    </h3>

                    {unclassifiedConsonants.length > 0 && (
                        <div className="mb-4 p-3 bg-neutral-900 border border-neutral-800 rounded text-sm text-neutral-200">
                            <div className="text-xs text-neutral-400 mb-2">{t('phonology.unclassified_consonants')}</div>
                            <div className="flex flex-wrap gap-2">
                                {unclassifiedConsonants.map((p, i) => (
                                    <span key={`uncons-${i}`} className="px-2 py-1 bg-neutral-800 rounded font-serif text-lg">{p.symbol}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {PLACES.map(place => (
                                    <th key={place} className="p-2 text-xs font-bold text-neutral-500 uppercase rotate-0">{t(`phonology.place.${place}`)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MANNERS.map(manner => (
                                <tr key={manner} className="border-t border-neutral-800">
                                    <th className="p-2 text-xs font-bold text-neutral-500 uppercase text-right whitespace-nowrap pr-4">{t(`phonology.manner.${manner}`)}</th>
                                    {PLACES.map(place => {
                                        const phonemes = getConsonants(manner, place).filter(p => p.symbol);
                                        return (
                                            <td
                                                key={`${manner}-${place}`}
                                                className="p-2 text-center border-l border-neutral-800/50 hover:bg-neutral-900/50 transition-colors cursor-pointer group"
                                                onClick={() => {
                                                    setEditingPhoneme({ type: 'consonant', manner, place });
                                                    setVoiced(false);
                                                    setSymbol('');
                                                }}
                                            >
                                                <div className="flex justify-center gap-2 items-center min-h-[30px]">
                                                    {phonemes.length > 0 ? (
                                                        phonemes.map((p, idx) => (
                                                            <div key={idx} className="relative group/ph">
                                                                <span
                                                                    title={`${p.voiced ? 'Voiced' : 'Unvoiced'} ${place} ${manner}`}
                                                                    className={`text-lg font-serif ${p.voiced ? 'text-neutral-200' : 'text-neutral-400'}`}
                                                                >
                                                                    {p.symbol}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemovePhoneme(data.consonants.indexOf(p), 'consonant'); }}
                                                                    className="absolute -top-4 -right-2 hidden group-hover/ph:block text-red-500 hover:text-red-400 bg-neutral-950 rounded-full"
                                                                >
                                                                    <X size={10} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Plus size={12} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Vowels Chart */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-neutral-200 mb-6 flex items-center gap-2">
                        <Volume2 size={20} className="text-neutral-500" /> {t('phonology.vowels')}
                    </h3>

                    <div className="relative w-full max-w-lg mx-auto aspect-[4/3] border border-neutral-800 bg-neutral-900/30 rounded-lg p-8">
                        {/* Simplified Vowel Trapezoid Grid */}
                        <div className="absolute inset-8 border border-neutral-700/30 skew-x-[-15deg] opacity-50 pointer-events-none"></div>

                        <div className="grid grid-cols-3 grid-rows-7 h-full w-full gap-2">
                            {/* Header Row */}
                            <div className="text-center text-xs text-neutral-500">{t('phonology.vowel_front')}</div>
                            <div className="text-center text-xs text-neutral-500">{t('phonology.vowel_central')}</div>
                            <div className="text-center text-xs text-neutral-500">{t('phonology.vowel_back')}</div>

                            {/* Rows */}
                            {HEIGHTS.map((height, rIdx) => (
                                <React.Fragment key={height}>
                                    {BACKNESS.map((back, cIdx) => {
                                        const vowels = getVowels(height, back);
                                        return (
                                            <div
                                                key={`${height}-${back}`}
                                                className="flex items-center justify-center border border-neutral-800/20 rounded hover:bg-neutral-800/50 transition-colors relative group cursor-pointer min-h-[40px]"
                                                onClick={() => {
                                                    setEditingPhoneme({ type: 'vowel', height, backness: back });
                                                    setRounded(false);
                                                    setSymbol('');
                                                }}
                                            >
                                                {/* Label only on left column */}
                                                {cIdx === 0 && <span className="absolute -left-16 text-[10px] text-neutral-600 uppercase w-12 text-right pointer-events-none">{t(`phonology.height.${height}`)}</span>}

                                                {vowels.length > 0 ? (
                                                    vowels.map((v, i) => (
                                                        <div key={`${v.symbol}-${i}`} className="relative group/ph">
                                                            <span className={`text-xl font-serif mx-1 ${v.rounded ? 'text-amber-400' : 'text-blue-300'}`} title={`${height} ${back} ${v.rounded ? 'rounded' : 'unrounded'}`}>
                                                                {v.symbol}
                                                            </span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleRemovePhoneme(data.vowels.indexOf(v), 'vowel'); }}
                                                                className="absolute -top-4 -right-2 hidden group-hover/ph:block text-red-500 hover:text-red-400 bg-neutral-950 rounded-full"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Plus size={12} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="text-center mt-4 text-xs text-neutral-500 flex justify-center gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-300 rounded-full"></span> {t('phonology.unrounded')}</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"></span> {t('phonology.rounded')}</span>
                    </div>

                    {unclassifiedVowels.length > 0 && (
                        <div className="mt-4 p-3 bg-neutral-900 border border-neutral-800 rounded text-sm text-neutral-200">
                            <div className="text-xs text-neutral-400 mb-2">{t('phonology.unclassified_vowels')}</div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {unclassifiedVowels.map((v, i) => (
                                    <span key={`unvow-${i}`} className="px-2 py-1 bg-neutral-800 rounded font-serif text-xl">{v.symbol}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Phoneme Editor Modal */}
            {editingPhoneme && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                            <h3 className="text-md font-bold text-neutral-100 flex items-center gap-2 capitalize">
                                <Plus size={16} className="text-blue-500" />
                                {editingPhoneme.type === 'consonant' ? t('phonology.add_consonant') : t('phonology.add_vowel')}
                            </h3>
                            <button onClick={() => setEditingPhoneme(null)} className="text-neutral-500 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-xs text-neutral-500 uppercase font-bold text-center">
                                {editingPhoneme.type === 'consonant'
                                    ? `${t(`phonology.place.${editingPhoneme.place}`)} ${t(`phonology.manner.${editingPhoneme.manner}`)}`
                                    : `${t(`phonology.height.${editingPhoneme.height}`)} ${t(`phonology.backness.${editingPhoneme.backness}`)}`
                                }
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-400 uppercase">{t('phonology.symbol_label')}</label>
                                <input
                                    autoFocus
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSavePhoneme()}
                                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-neutral-100 font-serif text-2xl text-center focus:border-blue-500 outline-none"
                                    placeholder={t('phonology.symbol_placeholder')}
                                />
                            </div>
                            {editingPhoneme.type === 'consonant' ? (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={voiced}
                                        onChange={(e) => setVoiced(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors relative ${voiced ? 'bg-blue-600' : 'bg-neutral-700'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${voiced ? 'translate-x-4' : ''}`} />
                                    </div>
                                    <span className="text-sm text-neutral-300">{t('phonology.voiced')}</span>
                                </label>
                            ) : (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rounded}
                                        onChange={(e) => setRounded(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors relative ${rounded ? 'bg-amber-600' : 'bg-neutral-700'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${rounded ? 'translate-x-4' : ''}`} />
                                    </div>
                                    <span className="text-sm text-neutral-300">{t('phonology.rounded')}</span>
                                </label>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex justify-end gap-3">
                            <button onClick={() => setEditingPhoneme(null)} className="px-4 py-2 text-neutral-400 hover:text-white text-sm">{t('common.cancel')}</button>
                            <button
                                onClick={handleSavePhoneme}
                                disabled={!symbol}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded flex items-center gap-2"
                            >
                                <Check size={16} /> {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Preview Floating Panel */}
            {pendingPhonology && showPreview && (
                <div className={`fixed bottom-10 right-10 z-[80] transition-all duration-300 ${isPreviewMinimized ? 'w-48 h-12' : 'w-96 h-[500px]'} bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5`}>
                    <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex justify-between items-center cursor-pointer" onClick={() => setIsPreviewMinimized(!isPreviewMinimized)}>
                        <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                            <Wand2 size={14} className="text-purple-400" />
                            {t('phonology.ai_review')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setIsPreviewMinimized(!isPreviewMinimized); }} className="text-neutral-500 hover:text-white">
                                {isPreviewMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowPreview(false); }} className="text-neutral-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isPreviewMinimized && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-neutral-500 uppercase">{t('phonology.syllable_struct')}</div>
                                    <div className="text-emerald-400 font-mono text-sm bg-neutral-950 p-2 rounded border border-neutral-800">
                                        {pendingPhonology.syllableStructure || 'None'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-neutral-500 uppercase">{t('phonology.consonants')} ({pendingPhonology.consonants.length})</div>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-950 rounded border border-neutral-800 min-h-[50px]">
                                        {pendingPhonology.consonants.map((p, i) => (
                                            <span key={i} className="text-lg font-serif text-neutral-200 w-8 h-8 flex items-center justify-center bg-neutral-900 rounded" title={`${p.place} ${p.manner}`}>
                                                {p.symbol}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-neutral-500 uppercase">{t('phonology.vowels')} ({pendingPhonology.vowels.length})</div>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-950 rounded border border-neutral-800 min-h-[50px]">
                                        {pendingPhonology.vowels.map((v, i) => (
                                            <span key={i} className={`text-xl font-serif w-8 h-8 flex items-center justify-center bg-neutral-900 rounded ${v.rounded ? 'text-amber-400' : 'text-blue-300'}`} title={`${v.height} ${v.backness}`}>
                                                {v.symbol}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {pendingPhonology.bannedCombinations.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-neutral-500 uppercase">{t('phonology.banned_combinations')}</div>
                                        <div className="text-xs text-red-400 p-2 bg-neutral-950 rounded border border-neutral-800">
                                            {pendingPhonology.bannedCombinations.join(', ')}
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg flex items-start gap-3">
                                    <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-blue-200 leading-relaxed">
                                        {t('phonology.replace_warning')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex gap-2">
                                <button
                                    onClick={discardPending}
                                    className="flex-1 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                                >
                                    {t('phonology.discard')}
                                </button>
                                <button
                                    onClick={confirmReplace}
                                    className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all"
                                >
                                    <Check size={14} /> {t('phonology.apply_replace')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PhonologyEditor;