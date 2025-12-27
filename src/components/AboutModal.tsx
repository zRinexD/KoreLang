import React from 'react';
import { useTranslation } from '../i18n';
import { X, Github, ExternalLink } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="relative bg-[#1e1e1e] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>🚀</span> {t('msg.about_title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-600/20 rounded-2xl mx-auto flex items-center justify-center border border-blue-500/30">
                        <span className="text-4xl font-black text-blue-400">KL</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">KoreLang Core</h3>
                        <p className="text-neutral-400 text-sm">Professional Linguistic Development Environment</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-3">
                        <p className="text-sm text-neutral-300">
                            {t('msg.about_desc')}
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/zRinexD/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <Github size={14} /> GitHub
                            </a>
                            <a
                                href="https://github.com/zRinexD/KoreLang/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-200 transition-colors"
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
