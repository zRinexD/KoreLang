import React, { useState } from 'react';
import { Wand2, RefreshCw, Volume2, Info, LayoutGrid, EyeOff, ShieldAlert, Plus, Trash2, X, Check, Eye, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { generatePhonology, isApiKeySet } from '../services/geminiService';
import { PhonologyConfig, Phoneme } from '../types';
import { useTranslation } from '../i18n';
import { Card, Section, ViewLayout, FormField, ActionButton, CompactButton, Modal, SearchInput, StatBadge, CIcon, VIcon } from './ui';
import PhonemeGrid from './PhonemeGrid';

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
    const [showAIModal, setShowAIModal] = useState(false);
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

    const handleRemovePhoneme = (phoneme: Phoneme, type: 'consonant' | 'vowel') => {
        const listKey = type === 'consonant' ? 'consonants' : 'vowels';
        const currentList = data[listKey] || [];
        const idx = currentList.indexOf(phoneme);
        if (idx < 0) return;
        const updatedList = [...currentList];
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

    const totalPhonemes = (data.consonants?.length || 0) + (data.vowels?.length || 0);

    const headerActions = (
        <div className="flex items-center justify-between w-full gap-6">
            {/* Left: Stats */}
            <div className="flex items-center gap-4">
                <StatBadge value={data.consonants?.length || 0} label="C" />
                <StatBadge value={data.vowels?.length || 0} label="V" />
                <CompactButton
                    onClick={clearAll}
                    variant="outline"
                    color="var(--error)"
                    icon={<Trash2 size={12} />}
                    label={t('phonology.clear_inventory')}
                />
            </div>
            {/* Right: AI Actions */}
            {enableAI && (
                <CompactButton
                    onClick={() => setShowAIModal(true)}
                    variant="solid"
                    icon={<Wand2 size={14} />}
                    label={t('phonology.generate_btn')}
                    color="var(--accent)"
                />
            )}
        </div>
    );

    return (
        <ViewLayout
            icon={Volume2}
            title={t('phonology.title')}
            subtitle={t('phonology.subtitle')}
            headerChildren={headerActions}
        >
            <div className="flex h-full p-6 overflow-hidden">

            {/* Charts */}
            <div className="flex-1 pr-2 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">

                {/* Consonants Chart */}
                <div className="flex-[3] h-full">
                <PhonemeGrid
                    title={t('phonology.consonants')}
                    icon={<CIcon size={16} />}
                    isVowels={false}
                    getPhonemes={(manner, place) => getConsonants(manner, place)}
                    onCellClick={(manner, place) => {
                        setEditingPhoneme({ type: 'consonant', manner, place });
                        setVoiced(false);
                        setSymbol('');
                    }}
                    onRemove={(phoneme) => handleRemovePhoneme(phoneme, 'consonant')}
                    renderPhoneme={(p) => (
                        <span
                            title={`${p.voiced ? 'Voiced' : 'Unvoiced'} ${p.place} ${p.manner}`}
                            className={`text-sm font-serif ${p.voiced ? 'text-neutral-200' : 'text-neutral-400'}`}
                        >
                            {p.symbol}
                        </span>
                    )}
                    minWidth={280}
                    unclassified={{
                        items: unclassifiedConsonants,
                        titleKey: 'phonology.unclassified_consonants',
                        position: 'top',
                    }}
                />
                </div>

                {/* Vowels Chart */}
                <div className="flex-[2] h-full">
                <PhonemeGrid
                    title={t('phonology.vowels')}
                    icon={<VIcon size={16} />}
                    isVowels={true}
                    getPhonemes={(height, back) => getVowels(height, back)}
                    onCellClick={(height, backness) => {
                        setEditingPhoneme({ type: 'vowel', height, backness });
                        setRounded(false);
                        setSymbol('');
                    }}
                    onRemove={(phoneme) => handleRemovePhoneme(phoneme, 'vowel')}
                    renderPhoneme={(v) => (
                        <span
                            className="font-serif text-sm"
                            style={{ color: v.rounded ? 'var(--accent)' : 'var(--text-secondary)' }}
                            title={`${v.height} ${v.backness} ${v.rounded ? 'rounded' : 'unrounded'}`}
                        >
                            {v.symbol}
                        </span>
                    )}
                    minWidth={200}
                    legend={(
                        <div className="flex justify-center gap-4">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--text-secondary)' }}></span> {t('phonology.unrounded')}</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span> {t('phonology.rounded')}</span>
                        </div>
                    )}
                    unclassified={{
                        items: unclassifiedVowels,
                        titleKey: 'phonology.unclassified_vowels',
                        position: 'bottom',
                        renderItem: (v, i) => (
                            <span key={`unvow-${i}`} className="px-2 py-1 font-serif text-xl border rounded bg-neutral-800 border-neutral-700" style={{ color: 'var(--text-primary)' }}>
                                {v.symbol}
                            </span>
                        ),
                    }}
                />
                </div>

                </div>
            </div>

            {/* Phoneme Editor Modal */}
            {editingPhoneme && (
                <Modal
                    isOpen={!!editingPhoneme}
                    onClose={() => setEditingPhoneme(null)}
                    title={editingPhoneme.type === 'consonant' ? t('phonology.add_consonant') : t('phonology.add_vowel')}
                    icon={<Plus size={16} />}
                    maxWidth="max-w-sm"
                    footer={
                        <>
                            <CompactButton
                                onClick={() => setEditingPhoneme(null)}
                                variant="outline"
                                color="var(--error)"
                                icon={<X size={12} />}
                                label={t('common.cancel')}
                            />
                            <CompactButton
                                onClick={handleSavePhoneme}
                                disabled={!symbol}
                                variant="solid"
                                color="var(--accent)"
                                icon={<Check size={16} />}
                                label={t('common.save')}
                            />
                        </>
                    }
                >
                    <div className="text-xs font-bold text-center uppercase" style={{ color: 'var(--text-tertiary)' }}>
                        {editingPhoneme.type === 'consonant'
                            ? `${t(`phonology.place.${editingPhoneme.place}`)} ${t(`phonology.manner.${editingPhoneme.manner}`)}`
                            : `${t(`phonology.height.${editingPhoneme.height}`)} ${t(`phonology.backness.${editingPhoneme.backness}`)}`
                        }
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>{t('phonology.symbol_label')}</label>
                        <input
                            autoFocus
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSavePhoneme()}
                            className="w-full p-3 font-serif text-2xl text-center border rounded outline-none"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
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
                            <div className={`w-10 h-6 rounded-full transition-colors relative`} style={{ backgroundColor: voiced ? 'var(--accent)' : 'var(--disabled)' }}>
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${voiced ? 'translate-x-4' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }} />
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('phonology.voiced')}</span>
                        </label>
                    ) : (
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rounded}
                                onChange={(e) => setRounded(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors relative`} style={{ backgroundColor: rounded ? 'var(--warning)' : 'var(--disabled)' }}>
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${rounded ? 'translate-x-4' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }} />
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('phonology.rounded')}</span>
                        </label>
                    )}
                </Modal>
            )}

            {/* AI Preview Floating Panel */}
            {pendingPhonology && showPreview && (
                <div className={`fixed bottom-10 right-10 z-[80] transition-all duration-300 ${isPreviewMinimized ? 'w-48 h-12' : 'w-96 h-[500px]'} bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5`}>
                    <div className="flex items-center justify-between px-4 py-3 border-b cursor-pointer bg-neutral-950 border-neutral-800" onClick={() => setIsPreviewMinimized(!isPreviewMinimized)}>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                            <Wand2 size={14} style={{ color: 'var(--accent)' }} />
                            {t('phonology.ai_review')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPreviewMinimized(!isPreviewMinimized); }}
                                className="text-neutral-500"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                {isPreviewMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}
                                className="text-neutral-500"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isPreviewMinimized && (
                        <>
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                                <div className="space-y-1">
                                    <div className="text-xs font-bold uppercase text-neutral-500">{t('phonology.syllable_struct')}</div>
                                    <div className="p-2 font-mono text-sm border rounded text-emerald-400 bg-neutral-950 border-neutral-800">
                                        {pendingPhonology.syllableStructure || 'None'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs font-bold uppercase text-neutral-500">{t('phonology.consonants')} ({pendingPhonology.consonants.length})</div>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-950 rounded border border-neutral-800 min-h-[50px]">
                                        {pendingPhonology.consonants.map((p, i) => (
                                            <span key={i} className="flex items-center justify-center w-8 h-8 font-serif text-lg rounded text-neutral-200 bg-neutral-900" title={`${p.place} ${p.manner}`}>
                                                {p.symbol}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs font-bold uppercase text-neutral-500">{t('phonology.vowels')} ({pendingPhonology.vowels.length})</div>
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
                                        <div className="text-xs font-bold uppercase text-neutral-500">{t('phonology.banned_combinations')}</div>
                                        <div className="p-2 text-xs text-red-400 border rounded bg-neutral-950 border-neutral-800">
                                            {pendingPhonology.bannedCombinations.join(', ')}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-900/10 border-blue-900/30">
                                    <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-blue-200 leading-relaxed">
                                        {t('phonology.replace_warning')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 p-4 border-t bg-neutral-950 border-neutral-800">
                                <CompactButton
                                    onClick={discardPending}
                                    variant="ghost"
                                    icon={<X size={14} />}
                                    label={t('phonology.discard')}
                                    className="flex-1"
                                />
                                <CompactButton
                                    onClick={confirmReplace}
                                    variant="solid"
                                    color="var(--accent)"
                                    icon={<Check size={14} />}
                                    label={t('phonology.apply_replace')}
                                    className="flex-[2]"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* AI Generator Modal */}
            {enableAI && (
                <Modal
                    isOpen={showAIModal}
                    onClose={() => setShowAIModal(false)}
                    title={t('phonology.ai_generator')}
                    icon={<Wand2 size={18} />}
                    maxWidth="max-w-md"
                    footer={(
                        <>
                            <CompactButton
                                onClick={() => setShowAIModal(false)}
                                variant="outline"
                                color="var(--error)"
                                icon={<X size={12} />}
                                label={t('common.cancel')}
                            />
                            <CompactButton
                                onClick={() => {
                                    handleGenerate();
                                    setShowAIModal(false);
                                }}
                                icon={loading ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                                label={loading ? t('phonology.analyze_btn') : t('phonology.generate_btn')}
                                disabled={loading || !prompt}
                                color="var(--accent)"
                            />
                        </>
                    )}
                >
                    <FormField label={t('phonology.vibe_label')}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('phonology.vibe_placeholder')}
                            autoFocus
                            className="w-full px-3 py-2 text-sm border rounded-lg outline-none resize-none focus:ring-2"
                            style={{ 
                                backgroundColor: 'var(--surface)', 
                                borderColor: 'var(--border)', 
                                color: 'var(--text-primary)',
                                '--tw-ring-color': 'var(--accent)',
                                minHeight: '8rem'
                            } as React.CSSProperties}
                            rows={4}
                        />
                    </FormField>
                    {!isApiKeySet() && (
                        <div className="flex items-start gap-3 p-3 text-xs border rounded-lg bg-amber-950/20 border-amber-900/50 text-amber-200">
                            <ShieldAlert size={14} className="shrink-0 text-amber-500" />
                            <div>
                                {t('console.ai_failed_no_key')} <a href="https://github.com/zRinexD/KoreLang/" target="_blank" rel="noopener noreferrer" className="font-bold underline">{t('menu.docs')}</a>.
                            </div>
                        </div>
                    )}
                </Modal>
            )}
            </div>
        </ViewLayout>
    );
};

export default PhonologyEditor;