import React from 'react';
import { Modal } from './ui';
import { useTranslation } from '../i18n';
import { PhonemeInstance, PhonemeModel } from '../types';
import { Check, Plus } from 'lucide-react';

interface PhonemeManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;

    // The valid phoneme models for this specific cell (e.g. all Bilabial Plosives)
    validPhonemes: PhonemeModel[];

    // The phonemes currently in the user's inventory for this cell
    activePhonemes: PhonemeInstance[];

    onAdd: (model: PhonemeModel) => void;
    onRemove: (instance: PhonemeInstance) => void;
}

const PhonemeManagerModal: React.FC<PhonemeManagerModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    validPhonemes,
    activePhonemes,
    onAdd,
    onRemove
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    // Helper to check if a model is currently active
    const getActiveInstance = (modelId: string) =>
        activePhonemes.find(p => p.phoneme.id === modelId);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            maxWidth="max-w-md"
            icon={null}
        >
            {description && (
                <div className="mb-4 text-sm text-[var(--text-secondary)] text-center">
                    {description}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {validPhonemes.length === 0 ? (
                    <div className="col-span-full text-center text-[var(--text-tertiary)] py-4 text-sm">
                        {t('phonology.no_phoneme_found') || 'No phoneme found for this cell.'}
                    </div>
                ) : (
                    validPhonemes.map(model => {
                        const activeInstance = getActiveInstance(model.id);
                        const isActive = !!activeInstance;

                        return (
                            <button
                                key={model.id}
                                onClick={() => {
                                    if (isActive) {
                                        onRemove(activeInstance);
                                    } else {
                                        onAdd(model);
                                    }
                                }}
                                className={`
                                    relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                                    ${isActive
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
                                    }
                                `}
                            >
                                <span className="text-2xl font-serif mb-1">{model.symbol}</span>
                                <span className="text-[10px] uppercase tracking-wide text-center leading-tight opacity-80">
                                    {model.name}
                                </span>

                                {/* Status Icon */}
                                <div className={`
                                    absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center
                                    ${isActive ? 'bg-[var(--accent)] text-white' : 'bg-[var(--border)] text-[var(--text-tertiary)]'}
                                `}>
                                    {isActive ? <Check size={10} strokeWidth={4} /> : <Plus size={10} />}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] font-semibold hover:bg-[var(--elevated)] transition-colors"
                >
                    {t('common.done') || 'Done'}
                </button>
            </div>
        </Modal>
    );
};

export default PhonemeManagerModal;
