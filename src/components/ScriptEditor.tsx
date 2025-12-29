
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Feather, Save, Image as ImageIcon, Palette, Spline, RotateCw, RotateCcw, Square, Circle, Minus, Layers, Eye, EyeOff, Lock, Unlock, ChevronLeft, ChevronRight, Trash2, ChevronUp, ChevronDown, Plus, Edit3, Type, Grid } from 'lucide-react';
import { ScriptConfig, ScriptGlyph, ProjectConstraints, GlyphStroke } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';
import { Card, Section, ViewLayout, CompactButton, ToggleButton, Slider, SearchInput, StatBadge } from './ui';

interface ScriptEditorProps {
    scriptConfig: ScriptConfig;
    setScriptConfig: (config: ScriptConfig) => void;
    constraints?: ProjectConstraints;
}

const CANVAS_SIZE = 400;

const ScriptEditor: React.FC<ScriptEditorProps> = ({ scriptConfig, setScriptConfig, constraints }) => {
    const { t } = useTranslation();

    const [selectedChar, setSelectedChar] = useState<string>('a');
    const [isDirty, setIsDirty] = useState(false);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState<{ x: number, y: number }[]>([]);
    const [activeStrokePath, setActiveStrokePath] = useState<string>('');
    const [activeShape, setActiveShape] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    const [strokes, setStrokes] = useState<GlyphStroke[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
    const [undoStack, setUndoStack] = useState<GlyphStroke[][]>([]);
    const [redoStack, setRedoStack] = useState<GlyphStroke[][]>([]);

    const [showGrid, setShowGrid] = useState(true);
    const [strokeWidth, setStrokeWidth] = useState(15);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [glyphColor, setGlyphColor] = useState('#ffffff');
    const [brushCap, setBrushCap] = useState<'round' | 'square'>('round');
    const [drawMode, setDrawMode] = useState<'free' | 'line' | 'rect' | 'circle'>('free');
    const [canvasZoom, setCanvasZoom] = useState(1);
    const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

    // Sinkronisasi strokeWidth dengan layer aktif
    useEffect(() => {
        const activeLayer = strokes.find(s => s.id === activeLayerId);
        if (activeLayer && activeLayer.strokeWidth !== undefined) {
            setStrokeWidth(activeLayer.strokeWidth);
        }
        if (activeLayer && activeLayer.color) {
            setGlyphColor(activeLayer.color);
        }
    }, [activeLayerId]);

    useEffect(() => {
        const glyph = scriptConfig.glyphs.find(g => g.char === selectedChar);
        if (glyph && glyph.strokes && glyph.strokes.length > 0) {
            setStrokes(glyph.strokes);
            setActiveLayerId(glyph.strokes[glyph.strokes.length - 1].id);
        } else {
            const initialLayer: GlyphStroke = {
                id: 'layer-base-' + Date.now(),
                type: 'path',
                d: '',
                width: 0,
                strokeWidth: 15,
                cap: 'round',
                color: '#ffffff',
                visible: true,
                locked: false,
                label: 'Base Layer'
            };
            setStrokes([initialLayer]);
            setActiveLayerId(initialLayer.id);
        }
        setUndoStack([]);
        setRedoStack([]);
        setIsDirty(false);
    }, [selectedChar, scriptConfig]);

    const pushToUndo = useCallback(() => {
        setUndoStack(prev => [...prev, structuredClone(strokes)]);
        setRedoStack([]);
    }, [strokes]);

    const performUndo = useCallback(() => {
        if (undoStack.length === 0) return;
        const last = undoStack[undoStack.length - 1];
        setRedoStack(prev => [...prev, structuredClone(strokes)]);
        setStrokes(last);
        setUndoStack(prev => prev.slice(0, -1));
        setIsDirty(true);
    }, [undoStack, strokes]);

    const performRedo = useCallback(() => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setUndoStack(prev => [...prev, structuredClone(strokes)]);
        setStrokes(next);
        setRedoStack(prev => prev.slice(0, -1));
        setIsDirty(true);
    }, [redoStack, strokes]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        let clientX, clientY;
        if ('touches' in e) {
            clientX = (e as React.TouchEvent).touches[0].clientX;
            clientY = (e as React.TouchEvent).touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        const x = (clientX - CTM.e) / CTM.a;
        const y = (clientY - CTM.f) / CTM.d;
        return { x, y };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        const activeLayer = strokes.find(s => s.id === activeLayerId);
        if (activeLayer?.locked || activeLayer?.type === 'image') return;

        e.preventDefault();
        pushToUndo();
        setIsDrawing(true);
        setIsDirty(true);
        const { x, y } = getCoordinates(e);
        setCurrentPoints([{ x, y }]);
        if (drawMode === 'free' || drawMode === 'line') {
            setActiveStrokePath(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
        } else {
            setActiveShape({ x, y, w: 0, h: 0 });
        }
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoordinates(e);
        setCoords({ x, y });
        if (!isDrawing) return;
        e.preventDefault();

        if (drawMode === 'free') {
            setCurrentPoints(prev => [...prev, { x, y }]);
            setActiveStrokePath(prev => `${prev} L ${x.toFixed(1)} ${y.toFixed(1)}`);
        } else if (drawMode === 'line') {
            const start = currentPoints[0];
            setActiveStrokePath(`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`);
        } else if (activeShape) {
            setActiveShape({ ...activeShape, w: x - activeShape.x, h: y - activeShape.y });
        }
    };

    const handleEnd = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const currentWidth = strokeWidth;

        setStrokes(prev => {
            const nextStrokes = [...prev];
            const activeIdx = nextStrokes.findIndex(s => s.id === activeLayerId);

            if (activeIdx !== -1 && nextStrokes[activeIdx].type === 'path' && !nextStrokes[activeIdx].locked && (drawMode === 'free' || drawMode === 'line')) {
                nextStrokes[activeIdx] = {
                    ...nextStrokes[activeIdx],
                    d: nextStrokes[activeIdx].d + ` ${activeStrokePath}`,
                    strokeWidth: currentWidth,
                    color: glyphColor,
                    cap: brushCap
                };
                return nextStrokes;
            } else {
                const newId = 'layer-' + Date.now();
                let newStroke: GlyphStroke | null = null;

                if (drawMode === 'free' || drawMode === 'line') {
                    if (activeStrokePath) {
                        newStroke = {
                            id: newId, type: 'path', d: activeStrokePath, width: currentWidth,
                            strokeWidth: currentWidth, cap: brushCap, color: glyphColor, visible: true, locked: false,
                            label: `Layer ${prev.length + 1}`
                        };
                    }
                } else if (activeShape) {
                    const { x, y, w, h } = activeShape;
                    if (drawMode === 'rect') {
                        newStroke = {
                            id: newId, type: 'rect', d: `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`,
                            x, y, width: w, height: h, strokeWidth: currentWidth, cap: brushCap, color: glyphColor,
                            visible: true, locked: false, label: `Rectangle ${prev.length + 1}`
                        };
                    } else if (drawMode === 'circle') {
                        const radius = Math.sqrt(w * w + h * h);
                        newStroke = {
                            id: newId, type: 'circle', d: `M ${x - radius} ${y} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`,
                            x, y, width: radius * 2, radius, strokeWidth: currentWidth, cap: brushCap, color: glyphColor,
                            visible: true, locked: false, label: `Circle ${prev.length + 1}`
                        };
                    }
                }
                if (newStroke) {
                    setActiveLayerId(newId);
                    return [...prev, newStroke];
                }
            }
            return prev;
        });

        setActiveStrokePath('');
        setActiveShape(null);
        setCurrentPoints([]);
    };

    const handleCanvasWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setCanvasZoom(p => Math.min(Math.max(p + delta, 0.5), 4));
    };

    const renameLayer = (id: string, newLabel: string) => {
        setStrokes(prev => prev.map(s => s.id === id ? { ...s, label: newLabel } : s));
        setIsDirty(true);
    };

    const addNewLayer = () => {
        const newId = 'layer-man-' + Date.now();
        const newLayer: GlyphStroke = {
            id: newId, type: 'path', d: '', width: 0, strokeWidth: strokeWidth, cap: 'round', color: glyphColor,
            visible: true, locked: false, label: `New Layer ${strokes.length + 1}`
        };
        setStrokes([...strokes, newLayer]);
        setActiveLayerId(newId);
        setIsDirty(true);
    };

    const moveLayer = (id: string, dir: 'up' | 'down') => {
        const idx = strokes.findIndex(s => s.id === id);
        if (idx === -1) return;
        if (dir === 'up' && idx === strokes.length - 1) return;
        if (dir === 'down' && idx === 0) return;

        const nextStrokes = [...strokes];
        const targetIdx = dir === 'up' ? idx + 1 : idx - 1;
        [nextStrokes[idx], nextStrokes[targetIdx]] = [nextStrokes[targetIdx], nextStrokes[idx]];
        setStrokes(nextStrokes);
        setIsDirty(true);
    };

    const calculateGlyphWidth = (strokes: GlyphStroke[]) => {
        let maxX = 50;
        strokes.forEach(s => {
            if (!s.visible) return;
            if (s.type === 'path') {
                const matches = s.d.match(/([0-9.]+)\s+([0-9.]+)/g);
                if (matches) {
                    matches.forEach(m => {
                        const x = parseFloat(m.split(/\s+/)[0]);
                        if (x > maxX) maxX = x;
                    });
                }
            } else if (s.x !== undefined && s.width !== undefined) {
                if (s.x + s.width > maxX) maxX = s.x + s.width;
            }
        });
        return Math.min(CANVAS_SIZE, Math.max(50, maxX + 20));
    };

    // Mémoiser la liste filtrée des caractères
    const filteredChars = useMemo(() => 
        Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33))
            .filter(c => !sidebarSearch || c.toLowerCase().includes(sidebarSearch.toLowerCase()))
    , [sidebarSearch]);

    const saveGlyph = () => {
        const calculatedWidth = calculateGlyphWidth(strokes);
        const newGlyph: ScriptGlyph = {
            char: selectedChar,
            pua: `\\u${(0xE000 + selectedChar.charCodeAt(0)).toString(16).toUpperCase()}`,
            strokes: strokes,
            viewWidth: calculatedWidth
        };
        const existingIdx = scriptConfig.glyphs.findIndex(g => g.char === selectedChar);
        let newGlyphs = [...scriptConfig.glyphs];
        if (existingIdx >= 0) newGlyphs[existingIdx] = newGlyph;
        else newGlyphs.push(newGlyph);
        setScriptConfig({ ...scriptConfig, glyphs: newGlyphs });
        setIsDirty(false);
    };

    const toggleSpacingMode = () => {
        setScriptConfig({
            ...scriptConfig,
            spacingMode: scriptConfig.spacingMode === 'proportional' ? 'mono' : 'proportional'
        });
    };

    const importImageLayer = (base64: string) => {
        const newId = 'img-' + Date.now();
        const imageLayer: GlyphStroke = {
            id: newId, type: 'image', d: '', width: CANVAS_SIZE, height: CANVAS_SIZE, x: 0, y: 0,
            strokeWidth: 0, cap: 'round', color: '', visible: true, locked: false,
            label: `Reference Matrix`, imageUrl: base64, opacity: 0.5
        };
        setStrokes([imageLayer, ...strokes]);
        setActiveLayerId(newId);
        setIsDirty(true);
    };

    // Handlers optimisés avec useCallback
    const handleStrokeWidthChange = useCallback((newWidth: number) => {
        setStrokeWidth(newWidth);
        if (activeLayerId) {
            setStrokes(prev => prev.map(s => s.id === activeLayerId ? { ...s, strokeWidth: newWidth } : s));
            setIsDirty(true);
        }
    }, [activeLayerId]);

    const handleColorChange = useCallback((newColor: string) => {
        setGlyphColor(newColor);
        if (activeLayerId) {
            setStrokes(prev => prev.map(s => s.id === activeLayerId ? { ...s, color: newColor } : s));
            setIsDirty(true);
        }
    }, [activeLayerId]);

    const toggleLayerLock = useCallback((id: string) => {
        setStrokes(prev => prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
    }, []);

    const toggleLayerVisibility = useCallback((id: string) => {
        setStrokes(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    }, []);

    const deleteLayer = useCallback((id: string) => {
        setStrokes(prev => prev.filter(l => l.id !== id));
        if (activeLayerId === id) setActiveLayerId(null);
    }, [activeLayerId]);

    return (
        <ViewLayout
            icon={Feather}
            title={t('script.title')}
            subtitle={t('script.engine_subtitle')}
            headerChildren={
                <div className="flex items-center gap-4 text-slate-200">
                    <div className="flex gap-0 rounded h-[32px]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <ToggleButton
                            isActive={scriptConfig.spacingMode === 'proportional'}
                            onClick={toggleSpacingMode}
                            icon={<Type size={14} />}
                            label={t('script.spacing_proportional')}
                            title={t('script.spacing_proportional_desc')}
                            position="first"
                        />
                        <ToggleButton
                            isActive={scriptConfig.spacingMode === 'mono'}
                            onClick={toggleSpacingMode}
                            icon={<Grid size={14} />}
                            label={t('script.spacing_mono')}
                            title={t('script.spacing_mono_desc')}
                            position="last"
                        />
                    </div>

                                        <Card className="flex gap-1 p-1">
                                                {(
                                                    [
                                                        { mode: 'free', icon: <Spline size={16} />, title: t('script.tool_freehand_title') },
                                                        { mode: 'line', icon: <Minus size={16} />, title: t('script.tool_line_title') },
                                                        { mode: 'rect', icon: <Square size={16} />, title: t('script.tool_rect_title') },
                                                        { mode: 'circle', icon: <Circle size={16} />, title: t('script.tool_circle_title') }
                                                    ] as const
                                                ).map(item => (
                                                    <CompactButton
                                                        key={item.mode}
                                                        onClick={() => setDrawMode(item.mode)}
                                                        variant={drawMode === item.mode ? 'solid' : 'ghost'}
                                                        color="var(--accent)"
                                                        icon={item.icon}
                                                        label=""
                                                        className="p-1.5"
                                                    />
                                                ))}
                                        </Card>
                                        <Card className="flex items-center gap-1 p-1">
                                                <CompactButton
                                                        onClick={performUndo}
                                                        disabled={undoStack.length === 0}
                                                        variant="ghost"
                                                        color="var(--text-secondary)"
                                                        icon={<RotateCcw size={16} />}
                                                        label=""
                                                        className="p-1.5"
                                                />
                                                <CompactButton
                                                        onClick={performRedo}
                                                        disabled={redoStack.length === 0}
                                                        variant="ghost"
                                                        color="var(--text-secondary)"
                                                        icon={<RotateCw size={16} />}
                                                        label=""
                                                        className="p-1.5"
                                                />
                                        </Card>
                    <CompactButton
                        onClick={saveGlyph}
                        variant="solid"
                        color={isDirty ? 'var(--accent)' : 'var(--primary)'}
                        icon={<Save size={14} />}
                        label={isDirty ? t('script.commit') : t('script.synced')}
                    />
                </div>
            }
        >

            <div className="flex-1 flex overflow-hidden bg-[var(--background)] text-slate-200">
                <div className={`border-r border-neutral-800 flex flex-col bg-[var(--surface)]/50 transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-72'}`}>
                    <Card className="flex items-center justify-between p-3 border-b-0 rounded-none">
                        {!sidebarCollapsed && <span className="text-xs font-bold uppercase text-neutral-500">{t('script.symbol_map')}</span>}
                        <CompactButton
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            variant="ghost"
                            color="var(--text-secondary)"
                            icon={sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                            label=""
                            className="p-1"
                        />
                    </Card>

                    {!sidebarCollapsed && (
                        <div className="p-2 border-b border-neutral-800">
                            <SearchInput
                                value={sidebarSearch}
                                onChange={setSidebarSearch}
                                placeholder={t('script.find_placeholder')}
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap content-start flex-1 gap-1 p-2 overflow-y-auto custom-scrollbar">
                        {filteredChars.map(char => {
                                const glyph = scriptConfig.glyphs.find(g => g.char === char);
                                const hasGlyph = !!glyph;
                                const active = selectedChar === char;
                                return (
                                    <CompactButton
                                        key={char}
                                        onClick={() => setSelectedChar(char)}
                                        variant={active ? 'solid' : 'ghost'}
                                        color="var(--accent)"
                                        icon={
                                            <div className="relative flex items-center justify-center w-full h-full font-mono text-sm font-bold">
                                                {hasGlyph ? (
                                                    <div className="flex items-center justify-center w-full h-full p-2 overflow-hidden">
                                                        <ConScriptText text={char} scriptConfig={scriptConfig} />
                                                    </div>
                                                ) : (
                                                    char
                                                )}
                                                {hasGlyph && <span className="absolute w-2 h-2 border-2 rounded-full top-1 right-1 bg-emerald-400 border-neutral-950"></span>}
                                            </div>
                                        }
                                        label=""
                                        className="w-12 h-12 p-0"
                                    />
                                );
                            })}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-[var(--background)] overflow-hidden" onWheel={handleCanvasWheel}>
                    <div className="absolute z-10 flex flex-col gap-2 top-4 left-4">
                        <Card className="flex flex-col gap-3 items-center min-w-[50px] p-2">
                            <div className="flex flex-col items-center w-full gap-2">
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">Size</span>
                                <div className="relative flex items-center justify-center w-1 h-48">
                                    <div className="absolute w-48 h-1 -rotate-90 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                                        <Slider
                                            value={strokeWidth}
                                            onChange={handleStrokeWidthChange}
                                            min={1}
                                            max={60}
                                            className="w-full h-1"
                                        />
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-purple-400 font-bold">{strokeWidth}pt</span>
                            </div>
                            <label className="relative cursor-pointer p-1.5 hover:bg-neutral-800 rounded flex justify-center border border-neutral-700 group">
                                <Palette size={16} style={{ color: glyphColor }} className="transition-transform group-hover:scale-110" />
                                <input type="color" value={glyphColor} onChange={(e) => handleColorChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </label>
                        </Card>
                    </div>

                    <div className="relative w-[400px] h-[400px] bg-neutral-900/40 rounded-xl border border-neutral-800/50 shadow-2xl overflow-hidden cursor-crosshair touch-none select-none transition-transform duration-200" style={{ transform: `scale(${canvasZoom})`, backgroundImage: showGrid ? 'radial-gradient(rgba(148,163,184,0.1) 1px, transparent 1px)' : 'none', backgroundSize: '20px 20px' }}>
                        <svg ref={svgRef} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-full h-full" onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
                            {strokes.map((s) => s.visible && (
                                s.type === 'image' ? (
                                    <image key={s.id} href={s.imageUrl} x={s.x} y={s.y} width={s.width} height={s.height} opacity={s.opacity} className={activeLayerId === s.id ? 'outline outline-2 outline-purple-500' : ''} />
                                ) : (
                                    <path
                                        key={s.id}
                                        d={s.d}
                                        stroke={s.color}
                                        strokeWidth={s.strokeWidth}
                                        fill="none"
                                        strokeLinecap={s.cap}
                                        strokeLinejoin="round"
                                        strokeOpacity={s.locked ? 0.3 : 1}
                                        style={activeLayerId === s.id ? { filter: 'drop-shadow(0px 0px 8px rgba(168, 85, 247, 0.4))' } : {}}
                                    />
                                )
                            ))}
                            {activeStrokePath && <path d={activeStrokePath} stroke={glyphColor} strokeWidth={strokeWidth} fill="none" strokeLinecap={brushCap} strokeLinejoin="round" strokeOpacity="0.8" />}
                            {activeShape && drawMode === 'rect' && <rect x={activeShape.w < 0 ? activeShape.x + activeShape.w : activeShape.x} y={activeShape.h < 0 ? activeShape.y + activeShape.h : activeShape.y} width={Math.abs(activeShape.w)} height={Math.abs(activeShape.h)} stroke={glyphColor} strokeWidth={strokeWidth} fill="none" strokeOpacity="0.5" />}
                            {activeShape && drawMode === 'circle' && <circle cx={activeShape.x} cy={activeShape.y} r={Math.sqrt(activeShape.w ** 2 + activeShape.h ** 2)} stroke={glyphColor} strokeWidth={strokeWidth} fill="none" strokeOpacity="0.5" />}
                        </svg>
                    </div>
                    <div className="absolute z-10 flex items-center gap-2 bottom-4 left-4">
                        <StatBadge value={Math.round(coords.x)} label="X POS" />
                        <StatBadge value={Math.round(coords.y)} label="Y POS" />
                        <StatBadge value={`${Math.round(canvasZoom * 100)}%`} label="ZOOM" />
                        <StatBadge value={strokes.length} label="LAYERS" />
                    </div>
                </div>

                <div className="w-80 border-l border-neutral-800 bg-[var(--surface)]/50 flex flex-col">
                    <Card className="flex items-center justify-between p-3 border-b-0 rounded-none rounded-b-none">
                        <div className="flex items-center gap-2">
                            <Layers size={14} className="text-purple-400" />
                            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Neural Layer Stack</span>
                        </div>
                        <CompactButton onClick={addNewLayer} variant="solid" color="var(--accent)" icon={<Plus size={14} />} label="" className="p-1" title={t('script.add_layer_title')} />
                    </Card>
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                        {[...strokes].reverse().map((s, revIdx) => {
                            const actualIdx = strokes.length - 1 - revIdx;
                            const isEditing = editingLayerId === s.id;
                            return (
                                <Card key={s.id} onClick={() => setActiveLayerId(s.id)} className={`p-2 flex items-center justify-between transition-all cursor-pointer ${activeLayerId === s.id ? 'ring-2 ring-purple-500/50' : ''}`}>
                                    <div className="flex items-center flex-1 gap-3 overflow-hidden">
                                        <div className="flex flex-col gap-0.5">
                                            <button disabled={actualIdx === strokes.length - 1} onClick={(e) => { e.stopPropagation(); moveLayer(s.id, 'up'); }} className="p-0.5 text-neutral-700 hover:text-purple-400 disabled:opacity-10"><ChevronUp size={12} /></button>
                                            <button disabled={actualIdx === 0} onClick={(e) => { e.stopPropagation(); moveLayer(s.id, 'down'); }} className="p-0.5 text-neutral-700 hover:text-purple-400 disabled:opacity-10"><ChevronDown size={12} /></button>
                                        </div>
                                        <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-black border rounded border-neutral-800 shrink-0">
                                            {s.type === 'image' ? (
                                                <img src={s.imageUrl} className="object-cover w-full h-full opacity-50" />
                                            ) : (
                                                <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-8 h-8">
                                                    <path d={s.d} stroke={s.color} strokeWidth={s.strokeWidth * 1.5} fill="none" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    value={s.label}
                                                    onBlur={() => setEditingLayerId(null)}
                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingLayerId(null)}
                                                    onChange={(e) => renameLayer(s.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-slate-900 border border-purple-500 rounded px-1 py-0.5 text-[10px] text-white outline-none w-full"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 group/label">
                                                    <span className={`text-[10px] font-bold truncate ${activeLayerId === s.id ? 'text-purple-300' : 'text-neutral-400'}`}>{s.label}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); setEditingLayerId(s.id); }} className="opacity-0 group-hover/label:opacity-100 text-neutral-600 hover:text-purple-400"><Edit3 size={10} /></button>
                                                </div>
                                            )}
                                            <span className="text-[8px] text-neutral-600 uppercase font-mono">{s.type} {s.type !== 'image' && `• ${s.strokeWidth}pt`}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); toggleLayerLock(s.id); }} className={`p-1 rounded hover:bg-neutral-800 ${s.locked ? 'text-amber-500' : 'text-neutral-600'}`}>
                                            {s.locked ? <Lock size={12} /> : <Unlock size={12} />}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(s.id); }} className={`p-1.5 rounded hover:bg-neutral-800 ${s.visible ? 'text-neutral-500' : 'text-blue-500'}`}>{s.visible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                                        <button
                                            disabled={strokes.length <= 1}
                                            onClick={(e) => { e.stopPropagation(); deleteLayer(s.id); }}
                                            className={`p-1.5 rounded hover:bg-red-900/20 ${strokes.length <= 1 ? 'text-neutral-800 cursor-not-allowed' : 'text-neutral-700 hover:text-red-500'}`}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <Card className="flex flex-col gap-2 p-4 border-t-0 rounded-none rounded-t-none">
                        <CompactButton onClick={() => fileInputRef.current?.click()} variant="ghost" color="var(--text-secondary)" icon={<ImageIcon size={12} />} label={t('script.import_reference')} className="justify-center w-full" />
                        <input type="file" ref={fileInputRef} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => { importImageLayer(reader.result as string); };
                                reader.readAsDataURL(file);
                            }
                        }} accept="image/*" className="hidden" />
                    </Card>
                </div>
            </div>
        </ViewLayout>
    );
};

export default ScriptEditor;
