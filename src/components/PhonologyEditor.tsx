import React, { useState } from 'react';
import { Wand2, RefreshCw, Volume2, Info, LayoutGrid, EyeOff, ShieldAlert } from 'lucide-react';
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
            setData(result);
        } catch (e) {
            alert("AI Generation failed. Check API Key or try again.");
        }
        setLoading(false);
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
                                            AI services require an API Key. Follow instructions in <a href="https://github.com/zRinexD/KoreLang/" target="_blank" rel="noopener noreferrer" className="underline font-bold">Documentation</a>.
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
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center opacity-50">
                        <EyeOff size={32} className="mb-2 text-neutral-500" />
                        <h3 className="font-bold text-neutral-300">{t('phonology.ai_disabled_title')}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{t('phonology.ai_disabled_desc')}</p>
                    </div>
                )}

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg flex-1">
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
                            <span className="bg-neutral-900 px-2 py-1 rounded text-emerald-400 font-mono text-xs border border-neutral-800 block text-center">
                                {data.syllableStructure || t('phonology.undefined')}
                            </span>
                        </div>
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
                            <div className="text-xs text-neutral-400 mb-2">{t('phonology.unclassified_consonants') || 'Unclassified consonants (from AI)'}</div>
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
                                    <th key={place} className="p-2 text-xs font-bold text-neutral-500 uppercase rotate-0">{place}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MANNERS.map(manner => (
                                <tr key={manner} className="border-t border-neutral-800">
                                    <th className="p-2 text-xs font-bold text-neutral-500 uppercase text-right whitespace-nowrap pr-4">{manner}</th>
                                        {PLACES.map(place => {
                                        const phonemes = getConsonants(manner, place).filter(p => p.symbol);
                                        return (
                                            <td key={`${manner}-${place}`} className="p-2 text-center border-l border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                                                <div className="flex justify-center gap-2">
                                                    {/* Logic to show voiced/unvoiced pairs properly is complex, defaulting to simple list for MVP */}
                                                    {phonemes.length > 0 && (
                                                        phonemes.map((p, idx) => (
                                                            <span
                                                                key={idx}
                                                                title={`${p.voiced ? 'Voiced' : 'Unvoiced'} ${place} ${manner}`}
                                                                className={`text-lg font-serif cursor-help ${p.voiced ? 'text-neutral-200' : 'text-neutral-400'}`}
                                                            >
                                                                {p.symbol}
                                                            </span>
                                                        ))
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
                            <div className="text-center text-xs text-neutral-500">Front</div>
                            <div className="text-center text-xs text-neutral-500">Central</div>
                            <div className="text-center text-xs text-neutral-500">Back</div>

                            {/* Rows */}
                            {HEIGHTS.map((height, rIdx) => (
                                <React.Fragment key={height}>
                                    {BACKNESS.map((back, cIdx) => {
                                        const vowels = getVowels(height, back);
                                        return (
                                            <div key={`${height}-${back}`} className="flex items-center justify-center border border-neutral-800/20 rounded hover:bg-neutral-800/50 transition-colors relative group">
                                                {/* Label only on left column */}
                                                {cIdx === 0 && <span className="absolute -left-16 text-[10px] text-neutral-600 uppercase w-12 text-right">{height}</span>}

                                                {vowels.map((v, i) => (
                                                    <span key={`${v.symbol}-${i}`} className={`text-xl font-serif mx-1 ${v.rounded ? 'text-amber-400' : 'text-blue-300'}`} title={`${height} ${back} ${v.rounded ? 'rounded' : 'unrounded'}`}>
                                                        {v.symbol}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="text-center mt-4 text-xs text-neutral-500 flex justify-center gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-300 rounded-full"></span> Unrounded</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"></span> Rounded</span>
                    </div>

                    {unclassifiedVowels.length > 0 && (
                        <div className="mt-4 p-3 bg-neutral-900 border border-neutral-800 rounded text-sm text-neutral-200">
                            <div className="text-xs text-neutral-400 mb-2">{t('phonology.unclassified_vowels') || 'Unclassified vowels (from AI)'}</div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {unclassifiedVowels.map((v, i) => (
                                    <span key={`unvow-${i}`} className="px-2 py-1 bg-neutral-800 rounded font-serif text-xl">{v.symbol}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PhonologyEditor;