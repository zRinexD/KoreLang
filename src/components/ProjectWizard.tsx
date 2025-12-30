import React, { useState, useEffect } from 'react';
import { Box, User, FileText, Check, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useUI } from '../ui/UIContext';
import { useProjectContext } from '../state/ProjectContext';
import { CompactButton, Modal } from './ui';

const ProjectWizard: React.FC = () => {
  const { t } = useTranslation();
  const ui = useUI();

  const {
    projectName,
    setProjectName,
    projectAuthor,
    setProjectAuthor,
    projectDescription,
    setProjectDescription,
    constraints,
    setConstraints
  } = useProjectContext();

  const [localName, setLocalName] = useState("");
  const [localAuthor, setLocalAuthor] = useState("");
  const [localDescription, setLocalDescription] = useState("");
  const [allowedGraphemes, setAllowedGraphemes] = useState("");

  const isOpen = ui.isOpen("wizard");
  const isCreateMode = !projectName;

  // Synchronise les champs locaux à l'ouverture de la modal
  useEffect(() => {
    if (isOpen) {
      setLocalName(projectName);
      setLocalAuthor(projectAuthor);
      setLocalDescription(projectDescription);
      setAllowedGraphemes("");
    }
  }, [isOpen, projectName, projectAuthor, projectDescription]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectName(localName);
    setProjectAuthor(localAuthor);
    setProjectDescription(localDescription);
    if (allowedGraphemes) {
      setConstraints({ ...constraints, allowedGraphemes });
    }
    ui.close("wizard");
  };

  const handleCreate = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => ui.close('wizard')}
      title={isCreateMode ? t('wizard.create_title') : t('wizard.edit_title')}
      icon={<Box size={20} />}
      maxWidth="max-w-lg"
      footer={
        <>
          <CompactButton
            onClick={() => ui.close('wizard')}
            variant="outline"
            color="var(--error)"
            icon={<Check size={12} />}
            label={t('common.cancel')}
          />
          <CompactButton
            onClick={handleCreate}
            variant="solid"
            color="var(--accent)"
            icon={<Check size={14} />}
            label={isCreateMode ? t('wizard.create_btn') : t('wizard.save_btn')}
          />
        </>
      }
    >
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.name')}</label>
            <div className="relative">
              <Box className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-600" size={16} />
              <input 
                type="text"
                required
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
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
                value={localAuthor}
                onChange={(e) => setLocalAuthor(e.target.value)}
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
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700 h-24 resize-none"
                placeholder={t('wizard.desc_placeholder')}
              />
            </div>
          </div>
        </form>
    </Modal>
  );
};

export default ProjectWizard;
