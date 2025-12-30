import React, { useState } from 'react';
import { Modal } from './ui';
import { useTranslation } from '../i18n';
import { PhonemeInstance, PhonemeModel } from '../types';
import { Trash2 } from 'lucide-react';

interface EditPhonemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    phonemeInstance: PhonemeInstance | null;
    availableOptions: PhonemeModel[];
    onReplace: (original: PhonemeInstance, newModel: PhonemeModel) => void;
    onDelete: (instance: PhonemeInstance) => void;
}

const EditPhonemeModal: React.FC<EditPhonemeModalProps> = ({
    isOpen,
    onClose,
    phonemeInstance,
    availableOptions,
    onReplace,
    onDelete
}) => {
    const { t } = useTranslation();
    const [selectedModelId, setSelectedModelId] = useState<string>('');

    React.useEffect(() => {
        if (isOpen && phonemeInstance) {
            // Default to current phoneme model ID if available in options, otherwise first option
            const currentId = phonemeInstance.phoneme.id;
            const found = availableOptions.find(p => p.id === currentId);
            if (found) {
                setSelectedModelId(found.id);
            } else if (availableOptions.length > 0) {
                setSelectedModelId(availableOptions[0].id);
            }
        }
    }, [isOpen, phonemeInstance, availableOptions]);

    if (!phonemeInstance) return null;

    const handleReplaceClick = () => {
        const newModel = availableOptions.find(p => p.id === selectedModelId);
        if (newModel) {
            onReplace(phonemeInstance, newModel);
            onClose();
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm(t('common.confirm') || 'Are you sure?')) {
            onDelete(phonemeInstance);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('phonology.edit_phoneme') || 'Edit Phoneme'}
            maxWidth="max-w-xs"
            icon={null}
        >
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <div className="text-3xl font-serif mb-2">{phonemeInstance.phoneme.symbol}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{phonemeInstance.phoneme.name}</div>
                </div>

                <div className="border-t border-[var(--border)] my-2"></div>

                <div>
                    <label className="text-xs font-bold uppercase text-[var(--text-tertiary)] mb-1 block">
                        {t('phonology.replace_with') || 'Replace With'}
                    </label>
                    <select
                        value={selectedModelId}
                        onChange={e => setSelectedModelId(e.target.value)}
                        className="w-full p-2 rounded bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                        {availableOptions.map(p => (
                            <option key={p.id} value={p.id}>
                                [{p.symbol}] {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleReplaceClick}
                        className="flex-1 px-4 py-2 rounded bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)]"
                    >
                        {t('phonology.replace') || 'Replace'}
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="px-4 py-2 rounded bg-[var(--error-bg)] text-[var(--error)] border border-[var(--error)] hover:bg-[var(--error)] hover:text-white transition-colors"
                        title={t('common.delete') || 'Delete'}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditPhonemeModal;
