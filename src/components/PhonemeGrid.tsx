import React, { useMemo, useState } from 'react';
import { X, Plus, ChevronsUpDown } from 'lucide-react';
import { PhonemeInstance, PhonemeModel } from '../types';
import { Card, Section } from './ui';
import PhonemeManagerModal from './PhonemeManagerModal';
import { useTranslation } from '../i18n';
import {
    MANNERS,
    PLACES,
    HEIGHTS,
    BACKNESS,
    impossibleVowelCells,
    impossibleConsonantCells
} from '../constants/phonologyConstants';


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


interface CellManagerState {
    open: boolean;
    row: string | null;
    col: string | null;
}

export type PhonemeGridWithModelsProps = PhonemeGridProps & {
    phonemeModels: PhonemeModel[];
    onAddPhoneme: (phoneme: PhonemeModel, row: string, col: string, isVowel: boolean) => void;
    onReplacePhoneme?: (original: PhonemeInstance, newModel: PhonemeModel) => void;
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
    onReplacePhoneme
}) => {
    // État pour la modal unifiée
    const [managerState, setManagerState] = useState<CellManagerState>({ open: false, row: null, col: null });
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
            className="p-1 text-center border-l bg-[var(--surface)] relative overflow-hidden"
            style={{ borderColor: 'var(--text-tertiary)', cursor: 'not-allowed', opacity: 0.6 }}
        >
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        var(--text-primary) 0,
                        var(--text-primary) 1px,
                        transparent 0,
                        transparent 8px
                    )`
                }}
            />
        </td>
    );

    // Get valid phonemes for the currently selected cell
    const getValidModelsForCell = (row: string, col: string) => {
        if (!row || !col) return [];
        if (isVowels) {
            return phonemeModels.filter(p => p.features?.height === row && p.features?.backness === col);
        } else {
            return phonemeModels.filter(p => p.features?.place === col && p.features?.manner === row);
        }
    };

    const activeCellModels = managerState.row && managerState.col
        ? getValidModelsForCell(managerState.row, managerState.col)
        : [];

    const activeCellPhonemes = managerState.row && managerState.col
        ? getPhonemes(managerState.row, managerState.col)
        : [];


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
                                            onClick={() => setManagerState({ open: true, row, col: columns[colIdx] })}
                                        >
                                            <div className="flex justify-center gap-1 items-center min-h-[20px] flex-wrap">
                                                {phonemes.length > 0 ? (
                                                    phonemes.map((p, idx) => (
                                                        <div key={`${row}-${columns[colIdx]}-${idx}-${p.phoneme.symbol}`}
                                                            className="relative group/ph cursor-pointer hover:bg-[var(--elevated)] rounded px-1 transition-colors"
                                                            // Also trigger manager on item click (propagation stops in manager logic if needed, but here it's the same action)
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setManagerState({ open: true, row, col: columns[colIdx] });
                                                            }}
                                                        >
                                                            {renderPhoneme(p)}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Plus
                                                        size={10}
                                                        className="transition-colors opacity-0 group-hover:opacity-100"
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

            {/* Unified Manager Modal */}
            <PhonemeManagerModal
                isOpen={managerState.open}
                onClose={() => setManagerState({ open: false, row: null, col: null })}
                title={managerState.row && managerState.col
                    ? `${columnLabel(managerState.col)} ${rowLabel(managerState.row)}`
                    : ''
                }
                validPhonemes={activeCellModels}
                activePhonemes={activeCellPhonemes}
                onAdd={(model) => {
                    if (managerState.row && managerState.col) {
                        onAddPhoneme(model, managerState.row, managerState.col, isVowels);
                    }
                }}
                onRemove={onRemove}
            />

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

