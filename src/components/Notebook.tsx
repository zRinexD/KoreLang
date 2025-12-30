import React, { useState } from 'react';
import { BookOpen, Eraser, Copy, Type } from 'lucide-react';
import { ConScriptText } from './ConScriptRenderer';
import { ScriptConfig } from '../types';
import { useTranslation } from '../i18n';
import { ViewLayout, CompactButton, StatBadge, Slider } from './ui';

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
        <ViewLayout
            icon={BookOpen}
            title={t('notebook.title')}
            subtitle={t('notebook.subtitle')}
            headerChildren={
                <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--surface)' }}>
                    <Type size={14} style={{ color: 'var(--text-secondary)' }} />
                    <Slider
                        value={fontSize}
                        onChange={setFontSize}
                        min={12}
                        max={128}
                        className="w-24 h-1"
                    />
                    <span className="text-[10px] font-mono w-8 text-center" style={{ color: 'var(--text-secondary)' }}>{fontSize}px</span>
                </div>
            }
        >

            {/* Split View */}
            <div className="flex h-full w-full overflow-hidden gap-4 p-4">
                {/* Input Area */}
                <div className="flex-1 flex flex-col overflow-hidden rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('notebook.input')}</h3>
                        <div className="flex items-center gap-1">
                            <CompactButton
                                onClick={() => setText('')}
                                variant="ghost"
                                icon={<Eraser size={14} />}
                                label=""
                                title={t('notebook.clear')}
                            />
                            <CompactButton
                                onClick={() => navigator.clipboard.writeText(text)}
                                variant="ghost"
                                icon={<Copy size={14} />}
                                label=""
                                title={t('notebook.copy')}
                            />
                            <StatBadge value={text.length} label="chars" />
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-transparent p-4 font-mono text-base leading-relaxed focus:outline-none resize-none overflow-y-auto"
                        style={{ color: 'var(--text-secondary)', caretColor: 'var(--accent)' }}
                        placeholder={t('notebook.placeholder')}
                        spellCheck={false}
                    />
                </div>

                {/* Render Area */}
                <div
                    ref={renderContainerRef}
                    className={`flex-1 flex flex-col overflow-hidden rounded border custom-scrollbar ${scriptConfig?.direction === 'ttb' ? 'overflow-x-auto' : ''}`}
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                >
                    <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('notebook.live_renderer')}</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {isScriptMode && scriptConfig ? (
                            <div
                                className="leading-loose break-words whitespace-pre-wrap transition-all duration-200"
                                style={{ fontSize: `${fontSize}px`, direction: scriptConfig.direction === 'rtl' ? 'rtl' : 'ltr', color: 'var(--text-primary)', textAlign: scriptConfig.direction === 'rtl' ? 'right' : 'left' }}
                            >
                                <ConScriptText text={text} scriptConfig={scriptConfig} />
                            </div>
                        ) : (
                            <div className="text-2xl leading-loose break-words whitespace-pre-wrap font-serif italic opacity-30 text-center" style={{ color: 'var(--text-secondary)' }}>
                                {text ? t('notebook.switch_prompt') : t('notebook.empty_sandbox')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ViewLayout>
    );
};

export default Notebook;