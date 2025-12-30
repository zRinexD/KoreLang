import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertTriangle, FileJson } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { ProjectData } from '../types';
import { useTranslation } from '../i18n';
import { ViewLayout, CompactButton } from './ui';

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
    <ViewLayout
      icon={FileJson}
      title={t('source.title')}
      subtitle={t('source.desc')}
      headerChildren={
        <div className="flex gap-2">
          <CompactButton
            onClick={handleReset}
            variant="ghost"
            color="var(--text-secondary)"
            icon={<RefreshCw size={16} />}
            label={t('source.reset')}
          />
          <CompactButton
            onClick={handleApply}
            variant="solid"
            color="var(--accent)"
            icon={<Save size={16} fill="currentColor" />}
            label={t('source.apply')}
          />
        </div>
      }
    >
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
    </ViewLayout>
  );
};

export default SourceView;