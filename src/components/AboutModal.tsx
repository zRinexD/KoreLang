import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useUI } from '../ui/UIContext';
import { Modal } from './ui';

const AboutModal: React.FC = () => {
    const ui = useUI();

    if (!ui.isOpen('about')) return null;

    return (
        <Modal
            isOpen={ui.isOpen('about')}
            onClose={() => ui.close('about')}
            title="About KoreLang"
            icon={<span>🚀</span>}
            maxWidth="max-w-md"
        >
            <div className="space-y-6 text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto border rounded-2xl" style={{ backgroundColor: 'rgb(from var(--accent) r g b / 0.2)', borderColor: 'var(--accent)' }}>
                    <span className="text-4xl font-black" style={{ color: 'var(--accent)' }}>KL</span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>KoreLang Core</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Professional Linguistic Development Environment</p>
                </div>

                <div className="p-4 space-y-3 border rounded-lg" style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        KoreLang is a modern tool for creating and managing conlangs, offering advanced linguistic features for phonology, morphology, orthography, and more.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://github.com/zRinexD/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-bold transition-colors"
                            style={{ color: 'var(--accent)' }}
                        >
                            <Github size={14} /> GitHub
                        </a>
                        <a
                            href="https://github.com/zRinexD/KoreLang/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-bold transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <ExternalLink size={14} /> Source
                        </a>
                    </div>
                </div>

                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)', paddingTop: '1rem' }}>
                    v1.1.1_stable • 2025
                </p>
            </div>
        </Modal>
    );
};

export default AboutModal;
