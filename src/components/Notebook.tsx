import React, { useState } from 'react';
import { BookOpen, Eraser, Save, Copy, ZoomIn, ZoomOut, Type } from 'lucide-react';
import { ConScriptText } from './ConScriptRenderer';
import { ScriptConfig } from '../types';
import { useTranslation } from '../i18n';

interface NotebookProps {
    scriptConfig?: ScriptConfig;
    isScriptMode?: boolean;
    text: string;
    setText: (text: string) => void;
}

const Notebook: React.FC<NotebookProps> = ({ scriptConfig, isScriptMode, text, setText }) => {
    const { t } = useTranslation(); // Add hook

    const [fontSize, setFontSize] = useState(24);
    const renderContainerRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to right when switching to TTB (Vertical)
    React.useEffect(() => {
        if (scriptConfig?.direction === 'ttb' && renderContainerRef.current) {
            renderContainerRef.current.scrollLeft = renderContainerRef.current.scrollWidth;
        }
    }, [scriptConfig?.direction, text]); // Re-run on text change to keep anchored? Maybe just direction switch is safer to avoid fighting user. Added text to keep it anchored if they are typing.

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)' }}>
                        <BookOpen style={{ color: 'var(--accent)' }} size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>{t('notebook.title')}</h2>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('notebook.subtitle')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* OPTICAL SCALING CONTROLS */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded border group" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--text-secondary)' }}>
                        <Type size={14} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="range"
                            min="12"
                            max="128"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-24 h-1 rounded-lg appearance-none cursor-pointer"
                            style={{ backgroundColor: 'var(--surface)' }}
                        />
                        <span className="text-[10px] font-mono w-8 text-center" style={{ color: 'var(--text-secondary)' }}>{fontSize}px</span>
                    </div>

                    <div className="flex gap-1 p-1 rounded border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--text-secondary)' }}>
                        <button onClick={() => setText('')} className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }} title={t('notebook.clear')}>
                            <Eraser size={16} />
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(text)} className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }} title={t('notebook.copy')}>
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Input Area */}
                <div className="flex-1 border-r border-slate-800 relative" style={{ backgroundColor: 'var(--surface)' }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-full bg-transparent p-6 font-mono text-base leading-relaxed focus:outline-none resize-none placeholder-slate-800"
                        style={{ color: 'var(--text-secondary)' }}
                        placeholder={t('notebook.placeholder')}
                        spellCheck={false}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono px-2 py-1 rounded" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--background)' }}>
                        {text.length} chars
                    </div>
                </div>

                {/* Render Area */}
                <div
                    ref={renderContainerRef}
                    className={`flex-1 p-8 relative custom-scrollbar ${scriptConfig?.direction === 'ttb' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto'}`}
                    style={{ backgroundColor: 'var(--background)' }}
                >
                    <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-secondary)' }}>
                        {t('notebook.live_renderer')}
                    </div>
                    {isScriptMode && scriptConfig ? (
                        <div
                            className="leading-loose break-words whitespace-pre-wrap transition-all duration-200 h-full"
                            style={{ fontSize: `${fontSize}px`, direction: scriptConfig.direction === 'rtl' ? 'rtl' : 'ltr', color: 'var(--text-primary)', textAlign: scriptConfig.direction === 'rtl' ? 'right' : 'left' }}
                        >
                            <ConScriptText text={text} scriptConfig={scriptConfig} />
                        </div>
                    ) : (
                        <div className="text-2xl leading-loose break-words whitespace-pre-wrap font-serif italic opacity-30 mt-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                            {text ? t('notebook.switch_prompt') : t('notebook.empty_sandbox')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notebook;