
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MenuBar from './components/MenuBar';
import Lexicon from './components/Lexicon';
import GrammarEditor from './components/GrammarEditor';
import GenEvolve from './components/GenEvolve';
import PhonologyEditor from './components/PhonologyEditor';
import Dashboard from './components/Dashboard';
import ConsoleConfig from './components/ConsoleConfig';
import SourceView from './components/SourceView';
import ScriptEditor from './components/ScriptEditor';
import Notebook from './components/Notebook';
import ProjectWizard from './components/ProjectWizard';
import ConstraintsModal from './components/ConstraintsModal';
import AboutModal from './components/AboutModal';
import SettingsModal from './components/SettingsModal';
import WhatsNewModal from './components/WhatsNewModal';
import { ViewState, LexiconEntry, SoundChangeRule, ProjectData, AppSettings, MorphologyState, PhonologyConfig, ProjectConstraints, LogEntry, ScriptConfig } from './types';
import { LanguageProvider, useTranslation, i18n } from './i18n';
import { PanelLeftOpen, LayoutDashboard, Activity, BookA, Languages, GitBranch, Terminal, FileJson, Feather, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'conlang_studio_autosave';
const SETTINGS_STORAGE_KEY = 'conlang_studio_settings';

const INITIAL_CONSTRAINTS_TEMPLATE: ProjectConstraints = {
  allowDuplicates: true,
  caseSensitive: false,
  bannedSequences: [],
  allowedGraphemes: '',
  phonotacticStructure: '',
  mustStartWith: [],
  mustEndWith: []
};

const INITIAL_SCRIPT_CONFIG: ScriptConfig = {
  name: 'Standard Script',
  direction: 'ltr',
  glyphs: [],
  spacingMode: 'proportional' // Activado por defecto: Protocolo de Estética Profesional
};

const THEMES = {
  dark: {
    bgMain: '#121212',
    bgPanel: '#1e1e1e',
    text1: '#f1f5f9',
    text2: '#94a3b8',
    accent: '#3b82f6'
  },
  light: {
    bgMain: '#f8fafc',
    bgPanel: '#ffffff',
    text1: '#0f172a',
    text2: '#475569',
    accent: '#2563eb'
  },
  'tokyo-night': {
    bgMain: '#1a1b26',
    bgPanel: '#24283b',
    text1: '#a9b1d6',
    text2: '#565f89',
    accent: '#7aa2f7'
  },
  'tokyo-light': {
    bgMain: '#d5d6db',
    bgPanel: '#cbccd1',
    text1: '#343b58',
    text2: '#565a6e',
    accent: '#34548a'
  }
};

const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConstraintsOpen, setIsConstraintsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [projectSessionId, setProjectSessionId] = useState<number>(Date.now());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScriptMode, setIsScriptMode] = useState(false);
  const [projectName, setProjectName] = useState(t('defaults.project_name'));
  const [projectAuthor, setProjectAuthor] = useState(t('defaults.author'));
  const [projectDescription, setProjectDescription] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<'create' | 'edit'>('create');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [jumpToTerm, setJumpToTerm] = useState<string | null>(null);
  const [draftEntry, setDraftEntry] = useState<Partial<LexiconEntry> | null>(null);
  const [consoleHistory, setConsoleHistory] = useState<LogEntry[]>([]);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
    return {
      theme: 'dark',
      autoSave: true,
      showLineNumbers: true,
      enableAI: true,
      language: i18n.language
    };
  });

  const [lexicon, setLexicon] = useState<LexiconEntry[]>([]);
  const [grammar, setGrammar] = useState(t('defaults.grammar'));
  const [morphology, setMorphology] = useState<MorphologyState>({ dimensions: [], paradigms: [] });
  const [phonology, setPhonology] = useState<PhonologyConfig>({ name: t('defaults.phonology_name'), description: '', consonants: [], vowels: [], syllableStructure: '', bannedCombinations: [] });
  const [rules, setRules] = useState<SoundChangeRule[]>([]);
  const [constraints, setConstraints] = useState<ProjectConstraints>(INITIAL_CONSTRAINTS_TEMPLATE);
  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>(INITIAL_SCRIPT_CONFIG);
  const [notebook, setNotebook] = useState('');

  const [genWordState, setGenWordState] = useState({
    generated: [], constraints: '', vibe: '', count: 10
  });

  // Re-calibración: Zoom Global solo mediante Alt + Rueda del ratón
  useEffect(() => {
    const handleGlobalWheelZoom = (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 5 : -5; // Velocidad de zoom optimizada
        setZoomLevel(p => Math.min(Math.max(p + delta, 50), 150));
      }
    };
    window.addEventListener('wheel', handleGlobalWheelZoom, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheelZoom);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const themeData = settings.theme === 'custom' && settings.customTheme
      ? settings.customTheme || THEMES.dark
      : (THEMES[settings.theme as keyof typeof THEMES] || THEMES.dark);

    const root = document.documentElement;
    root.style.setProperty('--bg-main', themeData.bgMain);
    root.style.setProperty('--bg-panel', themeData.bgPanel);
    root.style.setProperty('--text-1', themeData.text1);
    root.style.setProperty('--text-2', themeData.text2);
    root.style.setProperty('--accent', themeData.accent);
  }, [settings.theme, settings.customTheme]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings]);

  const loadProjectData = (data: ProjectData) => {
    setProjectSessionId(Date.now());
    if (data.name) setProjectName(data.name);
    setProjectAuthor(data.author || "Unknown");
    setProjectDescription(data.description || "");
    if (data.lexicon) setLexicon(data.lexicon);
    if (data.grammar) setGrammar(data.grammar);
    if (data.morphology) setMorphology(data.morphology);
    if (data.phonology) setPhonology(data.phonology);
    if (data.evolutionRules) setRules(data.evolutionRules);
    if (data.scriptConfig) {
      setScriptConfig(data.scriptConfig);
    } else {
      setScriptConfig(INITIAL_SCRIPT_CONFIG);
    }
    setNotebook(data.notebook || "");
    if (data.constraints) setConstraints({ ...INITIAL_CONSTRAINTS_TEMPLATE, ...data.constraints });
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try { loadProjectData(JSON.parse(savedData)); } catch (e) { console.error("Hydration failed", e); }
    }
    setIsLoaded(true);

    // Logic for What's New Panel (v1.1)
    const WHATS_NEW_KEY = 'whats_new_v1.1_seen';
    const hasSeen = sessionStorage.getItem(WHATS_NEW_KEY);
    if (!hasSeen) {
      setIsWhatsNewOpen(true);
    }
  }, []);

  const closeWhatsNew = () => {
    setIsWhatsNewOpen(false);
    sessionStorage.setItem('whats_new_v1.1_seen', 'true');
  };

  useEffect(() => {
    if (!isLoaded) return;
    const projectData: ProjectData = { version: "1.1", name: projectName, author: projectAuthor, description: projectDescription, lexicon, grammar, morphology, phonology, evolutionRules: rules, constraints, scriptConfig, notebook, lastModified: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData)); } catch (e) { console.error("Auto-save failed", e); }
  }, [projectName, projectAuthor, projectDescription, lexicon, grammar, morphology, phonology, rules, constraints, scriptConfig, notebook, isLoaded]);

  const handleWizardSubmit = (data: { name: string; author: string; description: string, constraints?: Partial<ProjectConstraints> }) => {
    if (wizardMode === 'create' && (typeof window !== 'undefined' && confirm(t('wizard.overwrite_confirm')))) {
      setIsLoaded(false); localStorage.removeItem(STORAGE_KEY); setProjectSessionId(Date.now());
      setLexicon([]); setGrammar(t('defaults.grammar')); setMorphology({ dimensions: [], paradigms: [] });
      setPhonology({ name: t('defaults.phonology_name'), description: '', consonants: [], vowels: [], syllableStructure: '', bannedCombinations: [] });
      setRules([]); setScriptConfig(INITIAL_SCRIPT_CONFIG); setIsScriptMode(false);
      setConstraints({ ...INITIAL_CONSTRAINTS_TEMPLATE, ...(data.constraints || {}) });
      setProjectName(data.name); setProjectAuthor(data.author); setProjectDescription(data.description);
      setCurrentView('DASHBOARD'); setTimeout(() => { setIsLoaded(true); }, 50);
    } else if (wizardMode === 'edit') {
      setProjectName(data.name); setProjectAuthor(data.author); setProjectDescription(data.description);
      if (data.constraints) setConstraints(prev => ({ ...prev, ...data.constraints }));
    }
    setIsWizardOpen(false);
  };

  const getFullProjectData = (): ProjectData => ({ version: "1.1", name: projectName, author: projectAuthor, description: projectDescription, lexicon, grammar, morphology, phonology, evolutionRules: rules, constraints, scriptConfig, notebook, lastModified: Date.now() });

  const renderView = () => {
    const commonProps = { scriptConfig, isScriptMode };
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard entries={lexicon} projectName={projectName} author={projectAuthor} description={projectDescription} setView={setCurrentView} {...commonProps} />;
      case 'PHONOLOGY': return <PhonologyEditor data={phonology} setData={setPhonology} enableAI={settings.enableAI} />;
      case 'LEXICON': return <Lexicon entries={lexicon} setEntries={setLexicon} constraints={constraints} enableAI={settings.enableAI} phonology={phonology} genWordState={genWordState} setGenWordState={setGenWordState} jumpToTerm={jumpToTerm} setJumpToTerm={setJumpToTerm} draftEntry={draftEntry} setDraftEntry={setDraftEntry} {...commonProps} />;
      case 'GRAMMAR': return <GrammarEditor grammar={grammar} setGrammar={setGrammar} morphology={morphology} setMorphology={setMorphology} showLineNumbers={settings.showLineNumbers} {...commonProps} />;
      case 'GENEVOLVE': return <GenEvolve entries={lexicon} onUpdateEntries={setLexicon} rules={rules} setRules={setRules} {...commonProps} />;
      case 'CONSOLE': return <ConsoleConfig constraints={constraints} setConstraints={setConstraints} settings={settings} setSettings={setSettings} entries={lexicon} setEntries={setLexicon} history={consoleHistory} setHistory={setConsoleHistory} setProjectName={setProjectName} setProjectDescription={setProjectDescription} setProjectAuthor={setProjectAuthor} setIsSidebarOpen={setIsSidebarOpen} setView={setCurrentView} setJumpToTerm={setJumpToTerm} setDraftEntry={setDraftEntry} author={projectAuthor} {...commonProps} />;
      case 'SCRIPT': return <ScriptEditor scriptConfig={scriptConfig} setScriptConfig={setScriptConfig} constraints={constraints} />;
      case 'NOTEBOOK': return <Notebook {...commonProps} text={notebook} setText={setNotebook} />;
      case 'SOURCE': return <SourceView data={getFullProjectData()} onApply={(data) => { loadProjectData(data); alert('Project state synced.'); }} />;
      default: return <Dashboard entries={lexicon} projectName={projectName} author={projectAuthor} description={projectDescription} setView={setCurrentView} {...commonProps} />;
    }
  };

  const navItems = [{ id: 'DASHBOARD', icon: LayoutDashboard }, { id: 'PHONOLOGY', icon: Activity }, { id: 'SCRIPT', icon: Feather }, { id: 'LEXICON', icon: BookA }, { id: 'GRAMMAR', icon: Languages }, { id: 'GENEVOLVE', icon: GitBranch }, { id: 'NOTEBOOK', icon: BookOpen }, { id: 'CONSOLE', icon: Terminal }, { id: 'SOURCE', icon: FileJson }];

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-main)] text-[var(--text-1)] font-sans overflow-hidden transition-colors duration-200">
      <MenuBar onNewProject={() => { setWizardMode('create'); setIsWizardOpen(true); }} onSaveProject={() => { if (typeof window !== 'undefined') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(getFullProjectData(), null, 2)], { type: 'application/json' })); a.download = `${projectName.toLowerCase().replace(/\s/g, '-')}.json`; a.click(); } }} onOpenProject={(file) => { const r = new FileReader(); r.onload = (e) => loadProjectData(JSON.parse(e.target?.result as string)); r.readAsText(file); }} onOpenSettings={() => setIsSettingsOpen(true)} onOpenConstraints={() => setIsConstraintsOpen(true)} onZoomIn={() => setZoomLevel(p => Math.min(p + 10, 150))} onZoomOut={() => setZoomLevel(p => Math.max(p - 10, 50))} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} settings={settings} isScriptMode={isScriptMode} onToggleScriptMode={() => setIsScriptMode(!isScriptMode)} onOpenAbout={() => setIsAboutOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        {isMobile && isSidebarOpen && <div className="absolute inset-0 bg-black/50 z-30 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
        {isSidebarOpen ? (
          <div className={`flex-shrink-0 bg-[var(--bg-panel)] w-64 border-e border-neutral-700 transition-all h-full ${isMobile ? 'absolute z-40 shadow-2xl' : 'relative'}`}>
            <Sidebar currentView={currentView} setView={setCurrentView} onOpenProjectSettings={() => { setWizardMode('edit'); setIsWizardOpen(true); }} onToggleSidebar={() => setIsSidebarOpen(false)} />
          </div>
        ) : (
          <div className="flex-shrink-0 bg-[var(--bg-panel)] w-12 border-e border-neutral-700 flex flex-col items-center py-2 gap-1.5 z-20 overflow-y-auto no-scrollbar">
            <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-500 hover:text-white p-2 rounded hover:bg-neutral-800 transition-colors mb-1">
              <PanelLeftOpen size={18} className={i18n.dir() === 'rtl' ? 'rotate-180' : ''} />
            </button>
            <div className="w-6 h-px bg-neutral-700 mb-1.5"></div>
            {navItems.map(item => (<button key={item.id} onClick={() => setCurrentView(item.id as ViewState)} className={`p-2 rounded transition-colors ${currentView === item.id ? 'text-blue-400 bg-neutral-800' : 'text-neutral-500 hover:text-neutral-200'}`} title={item.id}><item.icon size={18} /></button>))}
          </div>
        )}
        <main className="flex-1 overflow-auto bg-[var(--bg-main)] relative w-full" style={{ zoom: zoomLevel / 100 }}>{renderView()}</main>
      </div>
      <footer className="h-6 bg-[var(--bg-panel)] border-t border-neutral-700 flex items-center px-4 text-xs text-[var(--text-2)] gap-4 shrink-0 z-50 relative">
        <span className="flex items-center gap-1 text-emerald-500 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{t('footer.auto_saved')}</span>
        <span className="text-neutral-400">{projectName}</span>
        <span className="text-neutral-500/80 font-mono text-[11px]">v1.1</span>
        <span className="ml-auto">Ln 1, Col 1</span>
        <span>{lexicon.length} {t('footer.words')}</span>
        <span>{settings.enableAI ? t('footer.ai_ready') : t('footer.ai_off')}</span>
      </footer>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onUpdateSettings={setSettings} />
      <ConstraintsModal isOpen={isConstraintsOpen} onClose={() => setIsConstraintsOpen(false)} constraints={constraints} onUpdateConstraints={setConstraints} {...{ scriptConfig, isScriptMode }} onUpdateScriptConfig={setScriptConfig} />
      <ProjectWizard isOpen={isWizardOpen} mode={wizardMode} initialData={{ name: wizardMode === 'create' ? '' : projectName, author: wizardMode === 'create' ? '' : projectAuthor, description: wizardMode === 'create' ? '' : projectDescription }} onClose={() => setIsWizardOpen(false)} onSubmit={handleWizardSubmit} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <WhatsNewModal isOpen={isWhatsNewOpen} onClose={closeWhatsNew} />
    </div>
  );
};

const App: React.FC = () => (<LanguageProvider i18n={i18n}> <AppContent /> </LanguageProvider>);
export default App;
