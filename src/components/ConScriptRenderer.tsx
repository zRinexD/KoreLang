
import React from 'react';
import { ScriptConfig } from '../types';

interface ConScriptRendererProps {
    text: string;
    scriptConfig?: ScriptConfig;
    className?: string;
    scale?: number;
}

export const ConScriptText: React.FC<ConScriptRendererProps> = ({ text, scriptConfig, className, scale = 1 }) => {
    if (!scriptConfig) return <span className={className}>{text}</span>;

    const chars = text.split('');
    const CANVAS_SIZE = 400; 

    const isVertical = scriptConfig.direction === 'ttb';
    const cssDirection = isVertical ? undefined : (scriptConfig.direction as 'ltr' | 'rtl');
    const writingMode = isVertical ? 'vertical-rl' : undefined;
    const isProportional = scriptConfig.spacingMode === 'proportional';

    return (
        <span 
            className={`inline-flex items-baseline flex-wrap gap-[0.05em] ${className}`} 
            style={{ 
                direction: cssDirection || 'ltr',
                writingMode: writingMode,
                lineHeight: 1
            }}
            title={text}
        >
            {chars.map((char, idx) => {
                const glyph = scriptConfig.glyphs.find(g => g.char === char || g.pua === char);
                
                if (char === ' ') return <span key={idx} className="inline-block w-[0.25em] h-[1em]"></span>;

                if (glyph) {
                    // Cálculo de ancho dinámico para espaciado proporcional
                    const glyphWidth = isProportional && glyph.viewWidth 
                        ? (glyph.viewWidth / CANVAS_SIZE) 
                        : 0.75; // Por defecto o mono

                    return (
                        <svg 
                            key={idx}
                            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                            className="inline-block overflow-visible"
                            style={{ 
                                height: '0.75em', 
                                width: `${glyphWidth}em`, 
                                fill: 'none', 
                                verticalAlign: '-0.12em' 
                            }}
                            preserveAspectRatio="xMinYMid meet"
                            aria-hidden="true"
                        >
                            {glyph.strokes?.map((s, si) => (
                                s.visible && (
                                    s.type === 'image' ? (
                                        <image 
                                            key={si} 
                                            href={s.imageUrl} 
                                            x={s.x} 
                                            y={s.y} 
                                            width={s.width} 
                                            height={s.height} 
                                            opacity={s.opacity || 1} 
                                        />
                                    ) : (
                                        <path 
                                            key={si}
                                            d={s.d}
                                            stroke={s.color || 'currentColor'} 
                                            strokeWidth={`${s.strokeWidth || 15}px`}
                                            strokeLinecap={s.cap || 'round'}
                                            strokeLinejoin="round"
                                        />
                                    )
                                )
                            ))}
                            {glyph.imageUrl && !glyph.strokes?.some(s => s.type === 'image') && (
                                <image href={glyph.imageUrl} x="0" y="0" width={CANVAS_SIZE} height={CANVAS_SIZE} preserveAspectRatio="xMidYMid meet" opacity="0.8" />
                            )}
                        </svg>
                    );
                }

                // Fallback de "NotDef"
                return (
                    <svg 
                        key={idx}
                        viewBox="0 0 100 100"
                        className="inline-block opacity-20"
                        style={{ height: '0.7em', width: '0.5em', verticalAlign: '-0.1em' }}
                    >
                        <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="10" fill="none" />
                        <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="5" />
                        <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="5" />
                    </svg>
                );
            })}
        </span>
    );
};
