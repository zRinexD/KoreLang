import React from 'react';
import { Sparkles, ArrowRight, Languages, LucideIcon } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useUI } from '../ui/UIContext';
import { CompactButton, ModalBase } from './ui';

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

    const isOpen = ui.isOpen('whatsNew');
    if (!isOpen) return null;

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
        <ModalBase
            isOpen={isOpen}
            onClose={() => ui.close('whatsNew')}
            title={t('whats_new.title')}
            icon={<Sparkles size={20} className="text-[var(--accent)] animate-pulse" />}
            maxWidth="max-w-sm"
            hideFooter
            closeOnOverlayClick
            closeLabel={t('common.cancel')}
        >
            <div className="space-y-6">
                <div className="space-y-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mx-auto">
                        <Sparkles size={24} className="text-[var(--accent)] animate-pulse" />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {t('whats_new.subtitle') || ''}
                    </p>
                </div>

                <div className="space-y-5">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                            <div className={`w-10 h-10 rounded-xl ${feature.bg} border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[var(--accent)]/50 transition-colors`}>
                                <feature.icon size={20} className={feature.color} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-[var(--text-primary)]">{feature.title}</p>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <CompactButton
                    onClick={() => ui.close('whatsNew')}
                    variant="solid"
                    color="var(--accent)"
                    icon={<ArrowRight size={18} />}
                    label={t('whats_new.button')}
                    className="w-full justify-center py-4 rounded-2xl text-sm font-black shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>
        </ModalBase>
    );
};

export default WhatsNewModal;
