import React from 'react';
import { Sparkles, ArrowRight, Languages, LucideIcon } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useUI } from '../ui/UIContext';

interface FeatureItem {
    icon: LucideIcon;
    color: string;
    bg: string;
    title: string;
    desc: string;
}

const WhatsNewModal: React.FC = () => {
    const { t } = useTranslation();
    const ui = useUI();

    if (!ui.isOpen('whatsNew')) return null;

    const features: FeatureItem[] = [
        {
            icon: Languages,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            title: t('whats_new.f1_title'),
            desc: t('whats_new.f1_desc')
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[4px] animate-in fade-in duration-500"
                onClick={() => ui.close('whatsNew')}
            />

            <div className="relative bg-[var(--bg-panel)] border border-[var(--accent)]/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500">
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-4">
                            <Sparkles size={24} className="text-[var(--accent)] animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-[var(--text-1)] tracking-tight">
                            {t('whats_new.title')}
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className={`w-10 h-10 rounded-xl ${feature.bg} border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[var(--accent)]/50 transition-colors`}>
                                    <feature.icon size={20} className={feature.color} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-[var(--text-1)]">{feature.title}</p>
                                    <p className="text-xs text-[var(--text-2)] leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => ui.close('whatsNew')}
                        className="w-full py-4 bg-[var(--accent)] hover:brightness-110 text-white rounded-2xl text-sm font-black shadow-xl shadow-[var(--accent)]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t('whats_new.button')}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsNewModal;
