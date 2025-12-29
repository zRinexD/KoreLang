import React, { useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { Phoneme } from '../types';
import { Card, Section } from './ui';
import { useTranslation } from '../i18n';

const MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral-fricative', 'approximant', 'lateral-approximant'];
const PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
const HEIGHTS = ['close', 'near-close', 'close-mid', 'mid', 'open-mid', 'near-open', 'open'];
const BACKNESS = ['front', 'central', 'back'];

export interface PhonemeGridProps {
    title: string;
    icon: React.ReactNode;
    isVowels: boolean;
    getPhonemes: (row: string, col: string) => Phoneme[];
    onCellClick: (row: string, col: string) => void;
    onRemove: (phoneme: Phoneme) => void;
    renderPhoneme: (phoneme: Phoneme) => React.ReactNode;
    minWidth?: number;
    legend?: React.ReactNode;
    unclassified?: {
        items: Phoneme[];
        titleKey: string;
        position?: 'top' | 'bottom';
        renderItem?: (phoneme: Phoneme, index: number) => React.ReactNode;
    };
}

const PhonemeGrid: React.FC<PhonemeGridProps> = ({
    title,
    icon,
    isVowels,
    getPhonemes,
    onCellClick,
    onRemove,
    renderPhoneme,
    minWidth = 600,
    legend,
    unclassified,
}) => {
    const { t } = useTranslation();
    
    const columns = isVowels ? BACKNESS : PLACES;
    const rows = isVowels ? HEIGHTS : MANNERS;
    const columnLabel = (key: string) => t(`phonology.${isVowels ? 'backness' : 'place'}.${key}`);
    const rowLabel = (key: string) => t(`phonology.${isVowels ? 'height' : 'manner'}.${key}`);

    // Mémoiser les données de la grille pour éviter les recalculs
    const gridData = useMemo(() => {
        return rows.map(row => 
            columns.map(col => getPhonemes(row, col).filter(p => p.symbol))
        );
    }, [rows, columns, getPhonemes]);

    return (
    <Card className="flex flex-col h-full p-4 overflow-hidden">
        <Section title={title} icon={icon} className="mb-2" />

        {unclassified?.items?.length && unclassified.position !== 'bottom' ? (
            <div className="p-2 mb-2 text-sm border rounded" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <div className="mb-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{t(unclassified.titleKey)}</div>
                <div className="flex flex-wrap gap-2">
                    {unclassified.items.map((p, i) => unclassified.renderItem ? unclassified.renderItem(p, i) : (
                        <span key={`unclassified-${i}`} className="px-2 py-1 font-serif text-lg rounded" style={{ backgroundColor: 'var(--surface)' }}>{p.symbol}</span>
                    ))}
                </div>
            </div>
        ) : null}

        <div className="flex-1 overflow-auto">
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
                            return (
                                <td
                                    key={`${row}-${col}`}
                                    className={`p-1 text-center transition-colors cursor-pointer group hover:bg-[var(--surface)] ${colIdx === 0 ? 'border-l' : 'border-l'}`}
                                    style={{ borderColor: 'var(--text-tertiary)' }}
                                    onClick={() => onCellClick(row, col)}
                                >
                                    <div className="flex justify-center gap-1 items-center min-h-[20px]">
                                        {phonemes.length > 0 ? (
                                            phonemes.map((p, idx) => (
                                                <div key={`${row}-${col}-${idx}-${p.symbol}`} className="relative group/ph">
                                                    {renderPhoneme(p)}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onRemove(p); }}
                                                        className="absolute hidden rounded-full -top-4 -right-2 group-hover/ph:block"
                                                        style={{ color: 'var(--error)', backgroundColor: 'var(--background)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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

        {legend ? (
            <div className="mt-2 text-[10px] text-center" style={{ color: 'var(--text-tertiary)' }}>
                {legend}
            </div>
        ) : null}

        {unclassified?.items?.length && unclassified.position === 'bottom' ? (
            <div className="p-2 mt-2 text-xs border rounded" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <div className="mb-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t(unclassified.titleKey)}</div>
                <div className="flex flex-wrap gap-1">
                    {unclassified.items.map((p, i) => unclassified.renderItem ? unclassified.renderItem(p, i) : (
                        <span key={`unclassified-bottom-${i}`} className="px-1.5 py-0.5 font-serif text-sm rounded" style={{ backgroundColor: 'var(--surface)' }}>{p.symbol}</span>
                    ))}
                </div>
            </div>
        ) : null}
    </Card>
    );
};

export default PhonemeGrid;
