
import React, { useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';

import { PhonemeInstance, PhonemeModel, Manner, Place, Height, Backness, PhonemeType } from '../types';
import { PhonemeDataService } from '../services/PhonemeDataService';
import { Card, Section } from './ui';
import AddPhonemeModal from './AddPhonemeModal';
import { useTranslation } from '../i18n';
import { getPhonemesForCell, isCellPossible } from '../services/phonemeGridUtils';

const MANNERS = Object.values(Manner);
const PLACES = Object.values(Place);
const HEIGHTS = Object.values(Height);
const BACKNESS = Object.values(Backness);




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


// ...
interface AddPhonemeModalState {
    open: boolean;
    row: Manner | Height | null;
    col: Place | Backness | null;
}

export type PhonemeGridWithModelsProps = PhonemeGridProps & {
    onAddPhoneme: (phoneme: PhonemeInstance, row: string, col: string, isVowel: boolean) => void;
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
    onAddPhoneme,
}) => {
        // État pour la modal d'ajout de phonème
        const [addModal, setAddModal] = useState<AddPhonemeModalState>({ open: false, row: null, col: null });
    const { t } = useTranslation();
    
    const columns = isVowels ? BACKNESS : PLACES;
    const rows = isVowels ? HEIGHTS : MANNERS;
    const columnLabel = (key: string) => t(`phonology.${isVowels ? 'backness' : 'place'}.${key}`);
    const rowLabel = (key: string) => t(`phonology.${isVowels ? 'height' : 'manner'}.${key}`);

    // Nouvelle logique : on utilise l'enum PhonemeType comme source de vérité
    // Nouvelle logique : si l'inventaire est vide, on affiche uniquement des +
    const hasAnyPhoneme = useMemo(() => {
        for (let r of rows) {
            for (let c of columns) {
                if (getPhonemes(r, c).length > 0) return true;
            }
        }
        return false;
    }, [rows, columns, getPhonemes]);

    const gridData = useMemo(() => {
        return rows.map(row =>
            columns.map(col => {
                // Si aucun phonème n'a été ajouté, on force une case vide (pour le +)
                return hasAnyPhoneme ? getPhonemes(row, col) : [];
            })
        );
    }, [rows, columns, isVowels, getPhonemes, hasAnyPhoneme]);

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
                        <span key={`unclassified-${i}`} className="px-2 py-1 font-serif text-lg rounded" style={{ backgroundColor: 'var(--surface)' }}>{PhonemeDataService.getIPA(p.phoneme)}</span>
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
                            const impossible = !isCellPossible(rows[rowIdx], columns[colIdx], isVowels);
                            if (impossible) {
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
                                        {phonemes.length > 0 && hasAnyPhoneme ? (
                                            phonemes.map((p, idx) => {
                                                // S'assurer que p est bien un PhonemeInstance
                                                const phonemeInstance: PhonemeInstance = (p as any).phoneme && (p as any).type
                                                    ? (p as unknown as PhonemeInstance)
                                                    : {
                                                        id: (p as any).id || `${(p as any).symbol || p}-${row}-${col}`,
                                                        phoneme: (typeof p === 'string' ? p : (p as any).phoneme) as PhonemeType,
                                                        type: isVowels ? 'vowel' : 'consonant',
                                                    };
                                                return (
                                                    <div key={`${row}-${col}-${idx}-${PhonemeDataService.getIPA(phonemeInstance.phoneme)}`} className="relative group/ph">
                                                        {renderPhoneme(phonemeInstance)}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onRemove(phonemeInstance); }}
                                                            className="absolute hidden rounded-full -top-4 -right-2 group-hover/ph:block"
                                                            style={{ color: 'var(--error)', backgroundColor: 'var(--background)' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8' }
                                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1' }
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })
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
            place={addModal.col}
            manner={addModal.row}
            existingPhonemes={(() => {
                if (!addModal.row || !addModal.col) return [];
                const phonemes = getPhonemes(addModal.row, addModal.col);
                return phonemes.map((p) => ({
                    id: p.id,
                    symbol: PhonemeDataService.getIPA(p.phoneme) || p.phoneme,
                    name: p.phoneme
                }));
            })()}
            onSelect={(phonemeType) => {
                if (addModal.row && addModal.col) {
                    const phonemeInstance: PhonemeInstance = {
                        id: `${phonemeType}-${addModal.row}-${addModal.col}`,
                        phoneme: phonemeType,
                        type: isVowels ? 'vowel' : 'consonant',
                        ...(isVowels
                            ? { height: addModal.row as string, backness: addModal.col as string }
                            : { manner: addModal.row as string, place: addModal.col as string }
                        )
                    };
                    onAddPhoneme(phonemeInstance, addModal.row, addModal.col, isVowels);
                }
                setAddModal({ open: false, row: null, col: null });
            }}
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
                        <span key={`unclassified-bottom-${i}`} className="px-1.5 py-0.5 font-serif text-sm rounded" style={{ backgroundColor: 'var(--surface)' }}>{PhonemeDataService.getIPA(p.phoneme)}</span>
                    ))}
                </div>
            </div>
        ) : null}
    </Card>
    );
};

export default PhonemeGrid;
