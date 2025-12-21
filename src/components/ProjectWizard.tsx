import React, { useState, useEffect } from 'react';
import { X, Box, User, FileText, Check, ShieldCheck } from 'lucide-react';
import { ProjectConstraints } from '../types';
import { useTranslation } from '../i18n';

interface ProjectWizardProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData: { name: string; author: string; description: string };
  onClose: () => void;
  onSubmit: (data: { name: string; author: string; description: string, constraints?: Partial<ProjectConstraints> }) => void;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ isOpen, mode, initialData, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [allowedGraphemes, setAllowedGraphemes] = useState('');

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setAllowedGraphemes('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        constraints: allowedGraphemes ? { allowedGraphemes } : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Box className="text-blue-500" size={20} />
              {mode === 'create' ? t('wizard.create_title') : t('wizard.edit_title')}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {mode === 'create' ? t('wizard.create_desc') : t('wizard.edit_desc')}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('wizard.name')}</label>
            <div className="relative">
              <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                placeholder="e.g. High Valyrian"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('wizard.author')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                placeholder="e.g. J.R.R. Tolkien"
              />
            </div>
          </div>

          {/* New Constraint Input for Start */}
          {mode === 'create' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> {t('wizard.constraints')}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={allowedGraphemes}
                    onChange={(e) => setAllowedGraphemes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-700"
                    placeholder="e.g. a-zàá..."
                  />
                  <p className="text-[10px] text-slate-500 mt-1 ml-1">{t('wizard.optional')}</p>
                </div>
              </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('wizard.desc')}</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-600" size={16} />
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700 h-24 resize-none"
                placeholder="..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Check size={16} />
              {mode === 'create' ? t('wizard.create_btn') : t('wizard.save_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectWizard;