import React, { useState } from 'react';
import { BookOpen, Eraser, Save, Copy, ZoomIn, ZoomOut, Type } from 'lucide-react';
import { ConScriptText } from './ConScriptRenderer';
import { ScriptConfig } from '../types';

interface NotebookProps {
    scriptConfig?: ScriptConfig;
    isScriptMode?: boolean;
}

const Notebook: React.FC<NotebookProps> = ({ scriptConfig, isScriptMode }) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-900/20 rounded">
                        <BookOpen className="text-amber-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Notebook Sandbox</h2>
                        <p className="text-xs text-slate-400">Optical scaling enabled for detailed script inspection.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* OPTICAL SCALING CONTROLS */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 group">
                        <Type size={14} className="text-slate-500" />
                        <input 
                            type="range" 
                            min="12" 
                            max="128" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                        />
                        <span className="text-[10px] font-mono text-slate-500 w-8 text-center">{fontSize}px</span>
                    </div>

                    <div className="flex gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                        <button onClick={() => setText('')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Clear">
                            <Eraser size={16} />
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(text)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Copy Text">
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Input Area */}
                <div className="flex-1 border-r border-slate-800 relative bg-slate-900/30">
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-full bg-transparent p-6 text-slate-300 font-mono text-base leading-relaxed focus:outline-none resize-none placeholder-slate-800"
                        placeholder="Start drafting your manuscript here..."
                        spellCheck={false}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-600 bg-slate-900/80 px-2 py-1 rounded">
                        {text.length} chars
                    </div>
                </div>

                {/* Render Area */}
                <div className="flex-1 bg-[#1a1b26] p-8 overflow-y-auto relative custom-scrollbar">
                    <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-50">
                        Live Neural-Renderer
                    </div>
                    {isScriptMode && scriptConfig ? (
                        <div 
                            className="text-purple-200 leading-loose break-words whitespace-pre-wrap transition-all duration-200"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            <ConScriptText text={text} scriptConfig={scriptConfig} />
                        </div>
                    ) : (
                        <div className="text-2xl text-slate-700 leading-loose break-words whitespace-pre-wrap font-serif italic opacity-30 mt-10 text-center">
                            {text ? "Switch to Script Mode to see your glifos" : "The sandbox is empty..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notebook;