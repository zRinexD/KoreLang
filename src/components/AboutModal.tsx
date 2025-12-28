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

            <div className="relative bg-[#1e1e1e] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                        <span>🚀</span> About KoreLang
                    </h2>
                    <button
                        onClick={() => ui.close('about')}
                        className="p-1 transition-colors rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 text-center">

                    <div className="flex items-center justify-center w-24 h-24 mx-auto border bg-blue-600/20 rounded-2xl border-blue-500/30">
                        <span className="text-4xl font-black text-blue-400">KL</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">KoreLang Core</h3>
                        <p className="text-sm text-neutral-400">Professional Linguistic Development Environment</p>
                    </div>

                    <div className="p-4 space-y-3 border rounded-lg bg-white/5 border-white/5">
                        <p className="text-sm text-neutral-300">
                            KoreLang is a modern tool for creating and managing conlangs, offering advanced linguistic features for phonology, morphology, orthography, and more.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/zRinexD/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold text-blue-400 transition-colors hover:text-blue-300"
                            >
                                <Github size={14} /> GitHub
                            </a>
                            <a
                                href="https://github.com/zRinexD/KoreLang/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold transition-colors text-neutral-400 hover:text-neutral-200"
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
