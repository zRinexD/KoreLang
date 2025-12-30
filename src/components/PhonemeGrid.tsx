import React, { useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { PhonemeInstance, PhonemeModel } from '../types';
import { Card, Section } from './ui';
import AddPhonemeModal from './AddPhonemeModal';
import { useTranslation } from '../i18n';


const MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral-fricative', 'approximant', 'lateral-approximant'];
const PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
const HEIGHTS = ['close', 'near-close', 'close-mid', 'mid', 'open-mid', 'near-open', 'open'];
const BACKNESS = ['front', 'central', 'back'];

const impossibleVowelCells: Record<string, Record<string, boolean>> = {
    'close':      { front: false, central: false, back: false },
    'near-close': { front: false, central: true,  back: false },
    'close-mid':  { front: false, central: false, back: false },
    'mid':        { front: true,  central: false, back: true  },
    'open-mid':   { front: false, central: false, back: false },
    'near-open':  { front: false, central: false, back: true  },
    'open':       { front: false, central: true,  back: false },
};

const impossibleConsonantCells: Record<string, Record<string, boolean>> = {
    'plosive': {
        bilabial: false, labiodental: true,  dental: true,  alveolar: false, postalveolar: true,  retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: true,  glottal: false
    },
    'nasal': {
        bilabial: false, labiodental: false, dental: true,  alveolar: false, postalveolar: true,  retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: true,  glottal: true
    },
    'trill': {
        bilabial: false, labiodental: true,  dental: true,  alveolar: false, postalveolar: true,  retroflex: true,  palatal: true,  velar: true,  uvular: false, pharyngeal: true,  glottal: true
    },
    'tap': {
        bilabial: true,  labiodental: false, dental: true,  alveolar: false, postalveolar: true,  retroflex: false, palatal: true,  velar: true,  uvular: true,  pharyngeal: true,  glottal: true
    },
    'fricative': {
        bilabial: false, labiodental: false, dental: false, alveolar: false, postalveolar: false, retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: false, glottal: false
    },
    'lateral-fricative': {
        bilabial: true,  labiodental: true,  dental: true,  alveolar: false, postalveolar: true,  retroflex: true,  palatal: true,  velar: true,  uvular: true,  pharyngeal: true,  glottal: true
    },
    'approximant': {
        bilabial: true,  labiodental: false, dental: true,  alveolar: false, postalveolar: true,  retroflex: false, palatal: false, velar: false, uvular: true,  pharyngeal: true,  glottal: true
    },
    'lateral-approximant': {
        bilabial: true,  labiodental: true,  dental: true,  alveolar: false, postalveolar: true,  retroflex: false, palatal: false, velar: false, uvular: true,  pharyngeal: true,  glottal: true
    },
};

export type PhonemeGridProps = {
    title: string;
    icon: React.ReactNode;
    isVowels: boolean;
    getPhonemes: (row: string, col: string) => PhonemeInstance[];
    onRemove: (phoneme: PhonemeInstance) => void;
    renderPhoneme: (phoneme: PhonemeInstance) => React.ReactNode;
    minWidth?: number;
    legend?: React.ReactNode;
    unclassified?: {
        items: PhonemeInstance[];
        titleKey: string;
        position?: 'top' | 'bottom';
        renderItem?: (phoneme: PhonemeInstance, index: number) => React.ReactNode;
    };
};


interface AddPhonemeModalState {
    open: boolean;
    row: string | null;
    col: string | null;
}

export type PhonemeGridWithModelsProps = PhonemeGridProps & {
    phonemeModels: PhonemeModel[];
    onAddPhoneme: (phoneme: PhonemeModel, row: string, col: string, isVowel: boolean) => void;
};

const PhonemeGrid: React.FC<PhonemeGridWithModelsProps> = ({
    title,
    icon,
    isVowels,
    getPhonemes,
    onRemove,
    renderPhoneme,
    minWidth = 600,
    legend,
    unclassified,
    phonemeModels,
    onAddPhoneme,
}) => {
        // État pour la modal d'ajout de phonème
        const [addModal, setAddModal] = useState<AddPhonemeModalState>({ open: false, row: null, col: null });
    const { t } = useTranslation();
    
    const columns = isVowels ? BACKNESS : PLACES;
    const rows = isVowels ? HEIGHTS : MANNERS;
    const columnLabel = (key: string) => t(`phonology.${isVowels ? 'backness' : 'place'}.${key}`);
    const rowLabel = (key: string) => t(`phonology.${isVowels ? 'height' : 'manner'}.${key}`);

    // Mémoiser les données de la grille pour éviter les recalculs
    const gridData = useMemo(() => {
        return rows.map(row => 
            columns.map(col => {
                const arr = getPhonemes(row, col);
                if (!Array.isArray(arr)) return [];
                return arr.filter(p => p && p.phoneme && typeof p.phoneme.symbol === 'string');
            })
        );
    }, [rows, columns, getPhonemes]);

    // Composant réutilisable pour une case hachurée
    const HatchCell: React.FC = () => (
      <td
        className="p-1 text-center border-l bg-[var(--surface)] relative"
        style={{ borderColor: 'var(--text-tertiary)', cursor: 'not-allowed', opacity: 0.6, minWidth: 0, minHeight: 0 }}
      >
        <div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none select-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <pattern id="hatchPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect x="0" y="0" width="3" height="8" fill="var(--text-primary)" opacity="0.32" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#hatchPattern)" />
          </svg>
        </div>
      </td>
    );

    return (
    <Card className="flex flex-col h-full min-h-0 p-4 overflow-hidden">
        <Section title={title} icon={icon} className="mb-2 shrink-0" />

        {unclassified?.items?.length && unclassified.position !== 'bottom' ? (
            <div className="p-2 mb-2 text-sm border rounded shrink-0" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <div className="mb-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{t(unclassified.titleKey)}</div>
                <div className="flex flex-wrap gap-2">
                    {unclassified.items.map((p, i) => unclassified.renderItem ? unclassified.renderItem(p, i) : (
                        <span key={`unclassified-${i}`} className="px-2 py-1 font-serif text-lg rounded" style={{ backgroundColor: 'var(--surface)' }}>{p.phoneme.symbol}</span>
                    ))}
                </div>
            </div>
        ) : null}

        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse" style={{ fontSize: '0.75rem' }}>
            <thead>
                <tr>
                    <th className="w-4 p-0"></th>
                    {columns.map(col => (
                        <th key={col} className="p-1 text-[10px] font-bold text-center uppercase" style={{ color: 'var(--text-tertiary)' }}>
                            {columnLabel(col)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIdx) => (
                    <tr key={row} className={rowIdx === 0 ? '' : 'border-t'} style={{ borderColor: 'var(--text-tertiary)' }}>
                        <th className="py-1 pl-0 pr-1 text-[10px] font-bold text-left uppercase whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                            {rowLabel(row)}
                        </th>
                        {columns.map((col, colIdx) => {
                            const phonemes = gridData[rowIdx][colIdx];
                            const isImpossible = isVowels
                                ? impossibleVowelCells[rows[rowIdx]]?.[columns[colIdx]]
                                : impossibleConsonantCells[rows[rowIdx]]?.[columns[colIdx]];
                            if (isImpossible) {
                                return <HatchCell key={`${row}-${col}`} />;
                            }
                            return (
                                <td
                                    key={`${row}-${col}`}
                                    className={`p-1 text-center transition-colors cursor-pointer group hover:bg-[var(--surface)] border-l`}
                                    style={{ borderColor: 'var(--text-tertiary)' }}
                                    onClick={() => setAddModal({ open: true, row, col })}
                                >
                                    <div className="flex justify-center gap-1 items-center min-h-[20px]">
                                        {phonemes.length > 0 ? (
                                            phonemes.map((p, idx) => (
                                                <div key={`${row}-${col}-${idx}-${p.phoneme.symbol}`} className="relative group/ph">
                                                    {renderPhoneme(p)}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onRemove(p); }}
                                                        className="absolute hidden rounded-full -top-4 -right-2 group-hover/ph:block"
                                                        style={{ color: 'var(--error)', backgroundColor: 'var(--background)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8' }
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1' }
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <Plus
                                                size={10}
                                                className="transition-colors"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            />
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
        {/* Nouvelle modal d'ajout de phonème */}
        <AddPhonemeModal
                isOpen={addModal.open}
                onClose={() => setAddModal({ open: false, row: null, col: null })}
                place={addModal.col || ''}
                manner={addModal.row || ''}
                phonemes={phonemeModels}
                onSelect={(phoneme) => {
                    if (addModal.row && addModal.col) {
                        onAddPhoneme(phoneme, addModal.row, addModal.col, isVowels);
                    }
                    setAddModal({ open: false, row: null, col: null });
                } } isConsonant={!isVowels}        />

        {legend ? (
            <div className="mt-2 text-[10px] text-center shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                {legend}
            </div>
        ) : null}

        {unclassified?.items?.length && unclassified.position === 'bottom' ? (
            <div className="p-2 mt-2 text-xs border rounded shrink-0" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <div className="mb-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t(unclassified.titleKey)}</div>
                <div className="flex flex-wrap gap-1">
                    {unclassified.items.map((p, i) => unclassified.renderItem ? unclassified.renderItem(p, i) : (
                        <span key={`unclassified-bottom-${i}`} className="px-1.5 py-0.5 font-serif text-sm rounded" style={{ backgroundColor: 'var(--surface)' }}>{p.phoneme.symbol}</span>
                    ))}
                </div>
            </div>
        ) : null}
    </Card>
    );
};

export default PhonemeGrid;
