
import React, { useState, useEffect } from "react";
import { Box, User, FileText } from "lucide-react";
import { useTranslation } from "../i18n";
import { useUI } from "../ui/UIContext";
import { useProjectContext } from "../state/ProjectContext";
import { ModalWithDefaultFooter } from "./ui";

const NewProjectModal: React.FC = () => {
  const { t } = useTranslation();
  const ui = useUI();
  const { handlers } = useProjectContext();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const isOpen = ui.isOpen("newProject");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setAuthor("");
      setDescription("");
    }
  }, [isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlers.newProject({
      name,
      author,
      description,
    });
    ui.close("newProject");
    // Les champs seront reset par le useEffect ci-dessus
  };

  return (
    <ModalWithDefaultFooter
      isOpen={isOpen}
      onCancel={() => ui.close('newProject')}
      onValidate={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
      disableValidate={!name.trim()}
      title={t('wizard.create_title')}
      icon={<Box size={20} />}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.name')}</label>
          <div className="relative">
            <Box className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-600" size={16} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
              placeholder={t('wizard.author_placeholder')}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider uppercase text-slate-500">{t('wizard.desc')}</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-600" size={16} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700 h-24 resize-none"
              placeholder={t('wizard.desc_placeholder')}
            />
          </div>
        </div>
      </form>
    </ModalWithDefaultFooter>
  );
};

export default NewProjectModal;
