
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Feather, Save, Image as ImageIcon, Palette, Spline, RotateCw, RotateCcw, Square, Circle, Minus, Layers, Eye, EyeOff, Lock, Unlock, ChevronLeft, ChevronRight, Trash2, ChevronUp, ChevronDown, Plus, Search, Edit3, Type, Grid } from 'lucide-react';
import { ScriptConfig, ScriptGlyph, ProjectConstraints, GlyphStroke } from '../types';
import { useTranslation } from '../i18n';
import { ConScriptText } from './ConScriptRenderer';

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
        setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(strokes))]);
        setRedoStack([]);
    }, [strokes]);

    const performUndo = useCallback(() => {
        if (undoStack.length === 0) return;
        const last = undoStack[undoStack.length - 1];
        setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(strokes))]);
        setStrokes(last);
        setUndoStack(prev => prev.slice(0, -1));
        setIsDirty(true);
    }, [undoStack, strokes]);

    const performRedo = useCallback(() => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(strokes))]);
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

    return (
        <div className="h-full flex flex-col bg-[var(--background)] overflow-hidden text-slate-200">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[var(--surface)]/50 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/20 rounded"><Feather className="text-purple-500" size={20} /></div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>Neural-Glyph Studio v4.6</h2>
                        <p className="text-xs text-slate-500 tracking-wide uppercase font-bold">Professional Layer Engine</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded p-1">
                        <button
                            onClick={toggleSpacingMode}
                            className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                                scriptConfig.spacingMode === 'proportional' ? 'shadow' : ''
                            }`}
                            style={scriptConfig.spacingMode === 'proportional' ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}
                            title="Proportional Spacing (Dynamic Width)"
                        >
                            <Type size={14} /> Proportional
                        </button>
                        <button
                            onClick={toggleSpacingMode}
                            className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                                scriptConfig.spacingMode === 'mono' ? 'shadow' : ''
                            }`}
                            style={scriptConfig.spacingMode === 'mono' ? { backgroundColor: 'var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}
                            title="Monospaced (Fixed Grid)"
                        >
                            <Grid size={14} /> Monospace
                        </button>
                    </div>

                    <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded p-1">
                        <button onClick={() => setDrawMode('free')} className={`p-1.5 rounded ${drawMode === 'free' ? '' : ''}`} style={{ backgroundColor: drawMode === 'free' ? 'var(--accent)' : '' }} title={t('script.tool_freehand_title')}><Spline size={16} /></button>
                        <button onClick={() => setDrawMode('line')} className={`p-1.5 rounded ${drawMode === 'line' ? '' : ''}`} style={{ backgroundColor: drawMode === 'line' ? 'var(--accent)' : '' }} title={t('script.tool_line_title')}><Minus size={16} /></button>
                        <button onClick={() => setDrawMode('rect')} className={`p-1.5 rounded ${drawMode === 'rect' ? '' : ''}`} style={{ backgroundColor: drawMode === 'rect' ? 'var(--accent)' : '' }} title={t('script.tool_rect_title')}><Square size={16} /></button>
                        <button onClick={() => setDrawMode('circle')} className={`p-1.5 rounded ${drawMode === 'circle' ? '' : ''}`} style={{ backgroundColor: drawMode === 'circle' ? 'var(--accent)' : '' }} title={t('script.tool_circle_title')}><Circle size={16} /></button>
                    </div>
                    <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1">
                        <button onClick={performUndo} disabled={undoStack.length === 0} className="p-1.5 hover:bg-neutral-800 text-neutral-500 disabled:opacity-20" title="Undo (Ctrl+Z)"><RotateCcw size={16} /></button>
                        <button onClick={performRedo} disabled={redoStack.length === 0} className="p-1.5 hover:bg-neutral-800 text-neutral-500 disabled:opacity-20" title="Redo (Ctrl+Y)"><RotateCw size={16} /></button>
                    </div>
                    <button onClick={saveGlyph} className={`px-4 py-2 rounded font-bold flex items-center gap-2 shadow-lg transition-all ${isDirty ? 'scale-105' : ''}`} style={{ backgroundColor: isDirty ? 'var(--accent)' : 'var(--surface)', color: isDirty ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        <Save size={18} /> {isDirty ? 'Commit Changes' : 'Synced'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className={`border-r border-neutral-800 flex flex-col bg-[var(--surface)]/50 transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-72'}`}>
                    <div className="p-3 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                        {!sidebarCollapsed && <span className="text-xs font-bold text-neutral-500 uppercase">Symbol Map</span>}
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-neutral-800 rounded text-neutral-500">{sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
                    </div>

                    {!sidebarCollapsed && (
                        <div className="p-2 border-b border-neutral-800 bg-black/20 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-purple-500 transition-colors" size={14} />
                            <input
                                value={sidebarSearch}
                                onChange={(e) => setSidebarSearch(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded pl-8 pr-2 py-1.5 text-xs text-neutral-300 focus:border-purple-500 outline-none transition-all"
                                placeholder={t('script.find_placeholder')}
                            />
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto flex flex-wrap content-start p-2 gap-1 custom-scrollbar">
                        {Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33))
                            .filter(c => !sidebarSearch || c.toLowerCase().includes(sidebarSearch.toLowerCase()))
                            .map(char => {
                                const glyph = scriptConfig.glyphs.find(g => g.char === char);
                                const hasGlyph = !!glyph;
                                return (
                                    <button key={char} onClick={() => setSelectedChar(char)} className={`w-12 h-12 rounded flex items-center justify-center font-mono font-bold text-sm transition-all relative ${selectedChar === char ? 'bg-purple-600 text-white shadow-lg' : 'text-neutral-500 hover:bg-neutral-800'}`}>
                                        {hasGlyph ? <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden"><ConScriptText text={char} scriptConfig={scriptConfig} /></div> : char}
                                        {hasGlyph && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-neutral-950"></span>}
                                    </button>
                                );
                            })}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-[var(--background)] overflow-hidden" onWheel={handleCanvasWheel}>
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-3 shadow-2xl flex flex-col gap-4 items-center min-w-[50px]">
                            <div className="flex flex-col gap-2 items-center">
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">Size</span>
                                <div className="relative h-48 w-6 bg-neutral-800 rounded-full overflow-hidden flex items-end">
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={strokeWidth}
                                        onChange={(e) => {
                                            const newWidth = Number(e.target.value);
                                            setStrokeWidth(newWidth);
                                            // Update layer aktif secara real-time
                                            if (activeLayerId) {
                                                setStrokes(prev => prev.map(s => s.id === activeLayerId ? { ...s, strokeWidth: newWidth } : s));
                                                setIsDirty(true);
                                            }
                                        }}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 w-48 h-6 appearance-none cursor-pointer bg-transparent accent-purple-500 z-10"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-purple-600/20 pointer-events-none" style={{ height: `${(strokeWidth / 60) * 100}%` }}></div>
                                </div>
                                <span className="text-[10px] font-mono text-purple-400 font-bold">{strokeWidth}pt</span>
                            </div>
                            <label className="relative cursor-pointer p-2 hover:bg-neutral-800 rounded flex justify-center border border-neutral-700 group">
                                <Palette size={20} style={{ color: glyphColor }} className="group-hover:scale-110 transition-transform" />
                                <input type="color" value={glyphColor} onChange={(e) => {
                                    const newColor = e.target.value;
                                    setGlyphColor(newColor);
                                    if (activeLayerId) {
                                        setStrokes(prev => prev.map(s => s.id === activeLayerId ? { ...s, color: newColor } : s));
                                        setIsDirty(true);
                                    }
                                }} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </label>
                        </div>
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
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-neutral-900/80 p-2 rounded border border-neutral-800 text-[10px] font-mono text-neutral-500 backdrop-blur">
                        POS: {Math.round(coords.x)}/{Math.round(coords.y)} | CANVAS ZOOM: {Math.round(canvasZoom * 100)}% | LAYERS: {strokes.length}
                    </div>
                </div>

                <div className="w-80 border-l border-neutral-800 bg-[var(--surface)]/50 flex flex-col">
                    <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
                        <div className="flex items-center gap-2">
                            <Layers size={14} className="text-purple-400" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Neural Layer Stack</span>
                        </div>
                        <button onClick={addNewLayer} className="p-1.5 bg-purple-600 hover:bg-purple-500 rounded text-white shadow-lg transition-all" title={t('script.add_layer_title')}><Plus size={14} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {[...strokes].reverse().map((s, revIdx) => {
                            const actualIdx = strokes.length - 1 - revIdx;
                            const isEditing = editingLayerId === s.id;
                            return (
                                <div key={s.id} onClick={() => setActiveLayerId(s.id)} className={`group border rounded-lg p-2 flex items-center justify-between transition-all cursor-pointer ${activeLayerId === s.id ? 'bg-purple-900/20 border-purple-500/50 shadow-inner' : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-600'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        <div className="flex flex-col gap-0.5">
                                            <button disabled={actualIdx === strokes.length - 1} onClick={(e) => { e.stopPropagation(); moveLayer(s.id, 'up'); }} className="p-0.5 text-neutral-700 hover:text-purple-400 disabled:opacity-10"><ChevronUp size={12} /></button>
                                            <button disabled={actualIdx === 0} onClick={(e) => { e.stopPropagation(); moveLayer(s.id, 'down'); }} className="p-0.5 text-neutral-700 hover:text-purple-400 disabled:opacity-10"><ChevronDown size={12} /></button>
                                        </div>
                                        <div className="w-10 h-10 bg-black rounded border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                                            {s.type === 'image' ? (
                                                <img src={s.imageUrl} className="w-full h-full object-cover opacity-50" />
                                            ) : (
                                                <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="w-8 h-8">
                                                    <path d={s.d} stroke={s.color} strokeWidth={s.strokeWidth * 1.5} fill="none" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
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
                                        <button onClick={(e) => { e.stopPropagation(); setStrokes(prev => prev.map(l => l.id === s.id ? { ...l, locked: !l.locked } : l)); }} className={`p-1 rounded hover:bg-neutral-800 ${s.locked ? 'text-amber-500' : 'text-neutral-600'}`}>
                                            {s.locked ? <Lock size={12} /> : <Unlock size={12} />}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setStrokes(prev => prev.map(l => l.id === s.id ? { ...l, visible: !l.visible } : l)); }} className={`p-1.5 rounded hover:bg-neutral-800 ${s.visible ? 'text-neutral-500' : 'text-blue-500'}`}>{s.visible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                                        <button
                                            disabled={strokes.length <= 1}
                                            onClick={(e) => { e.stopPropagation(); setStrokes(prev => prev.filter(l => l.id !== s.id)); if (activeLayerId === s.id) setActiveLayerId(null); }}
                                            className={`p-1.5 rounded hover:bg-red-900/20 ${strokes.length <= 1 ? 'text-neutral-800 cursor-not-allowed' : 'text-neutral-700 hover:text-red-500'}`}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-2">
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-bold uppercase hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2">
                            <ImageIcon size={12} /> Import Reference Matrix
                        </button>
                        <input type="file" ref={fileInputRef} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => { importImageLayer(reader.result as string); };
                                reader.readAsDataURL(file);
                            }
                        }} accept="image/*" className="hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptEditor;
