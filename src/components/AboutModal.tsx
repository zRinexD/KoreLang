import React from 'react';
import { X, Github, ExternalLink } from 'lucide-react';
import { useUI } from '../ui/UIContext';

const AboutModal: React.FC = () => {
    const ui = useUI();

    if (!ui.isOpen('about')) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 duration-200 bg-black/60 backdrop-blur-sm animate-in fade-in"
                onClick={() => ui.close('about')}
            />

            <div className="relative rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                
                <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                    <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        <span>🚀</span> About KoreLang
                    </h2>
                    <button
                        onClick={() => ui.close('about')}
                        className="p-1 transition-colors rounded-lg hover:bg-white/10"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 text-center">

                    <div className="flex items-center justify-center w-24 h-24 mx-auto border rounded-2xl" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)', borderColor: 'var(--accent)' }}>
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

                    <p className="text-[10px] text-neutral-500 pt-4 uppercase tracking-widest">
                        v1.1.1_stable • 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
