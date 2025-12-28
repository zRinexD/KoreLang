import React, { useState, useEffect } from 'react';
import { X, Box, User, FileText, Check, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useUI } from '../ui/UIContext';
import { useProject } from '../hooks/useProject';

const ProjectWizard: React.FC = () => {
  const { t } = useTranslation();
  const ui = useUI();
  const { 
    projectName, setProjectName,
    projectAuthor, setProjectAuthor,
    projectDescription, setProjectDescription,
    constraints, setConstraints
  } = useProject();

  const [allowedGraphemes, setAllowedGraphemes] = useState('');

  const isOpen = ui.isOpen('wizard');
  const isCreateMode = !projectName; // si nom vide = création

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAllowedGraphemes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setProjectName(projectName || 'Untitled'); // éviter vide
    setProjectAuthor(projectAuthor || 'Unknown');

    if (allowedGraphemes) {
      setConstraints({ ...constraints, allowedGraphemes });
    }

    ui.close('wizard');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg overflow-hidden duration-200 border shadow-2xl bg-slate-900 border-slate-700 rounded-xl animate-in fade-in zoom-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800" style={{ backgroundColor: 'var(--bg-header)' }}>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Box className="text-blue-500" size={20} />
              {isCreateMode ? t('wizard.create_title') : t('wizard.edit_title')}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isCreateMode ? t('wizard.create_desc') : t('wizard.edit_desc')}
            </p>
          </div>
          <button onClick={() => ui.close('wizard')} className="p-1 transition-colors rounded text-slate-500 hover:text-white hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.name')}</label>
            <div className="relative">
              <Box className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                placeholder={t('wizard.name_placeholder')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.author')}</label>
            <div className="relative">
              <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                value={projectAuthor}
                onChange={(e) => setProjectAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                placeholder={t('wizard.author_placeholder')}
              />
            </div>
          </div>

          {isCreateMode && (
            <div className="space-y-1.5">
              <label className="items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 block-flex">
                  <ShieldCheck size={14} className="text-emerald-500" /> {t('wizard.constraints')}
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={allowedGraphemes}
                  onChange={(e) => setAllowedGraphemes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-700"
                  placeholder={t('wizard.constraints_placeholder')}
                />
                <p className="text-[10px] text-slate-500 mt-1 ml-1">{t('wizard.optional')}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.desc')}</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-600" size={16} />
              <textarea 
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700 h-24 resize-none"
                placeholder={t('wizard.desc_placeholder')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => ui.close('wizard')}
              className="px-4 py-2 text-sm font-medium transition-colors text-slate-400 hover:text-white"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 shadow-blue-900/20 active:scale-95"
            >
              <Check size={16} />
              {isCreateMode ? t('wizard.create_btn') : t('wizard.save_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectWizard;
