import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertTriangle, FileJson } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { ProjectData } from '../types';
import { useTranslation } from '../i18n';

interface SourceViewProps {
  data: ProjectData;
  onApply: (data: ProjectData) => void;
}

const SourceView: React.FC<SourceViewProps> = ({ data, onApply }) => {
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync state to text on mount or when data changes externally
  useEffect(() => {
    setJsonContent(JSON.stringify(data, null, 2));
  }, [data]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      onApply(parsed);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleReset = () => {
    setJsonContent(JSON.stringify(data, null, 2));
    setError(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <FileJson className="text-emerald-500" size={20} />
                    {t('source.title')}
                </h2>
                <p className="text-xs text-slate-400">{t('source.desc')}</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <RefreshCw size={16} /> {t('source.reset')}
                </button>
                <button 
                    onClick={handleApply}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Save size={16} fill="currentColor" /> {t('source.apply')}
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-red-900/20 border-b border-red-500/30 p-3 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle size={14} />
                <span className="font-mono">{error}</span>
            </div>
        )}

        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 relative">
                <CodeEditor 
                    value={jsonContent} 
                    onChange={setJsonContent} 
                    language="json" 
                    showLineNumbers={true}
                />
            </div>
        </div>
        
        <div className="p-2 border-t border-slate-800 bg-slate-900 text-[10px] text-amber-500/70 flex justify-center items-center gap-2">
            <AlertTriangle size={12} /> {t('source.warning')}
        </div>
    </div>
  );
};

export default SourceView;