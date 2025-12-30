import { useState, useEffect, SetStateAction } from "react";
import {
  LexiconEntry,
  MorphologyState,
  PhonologyConfig,
  SoundChangeRule,
  ProjectConstraints,
  ScriptConfig,
  ProjectData,
  ViewState,
} from "../types";
import { useSettings } from "../hooks/useSettings";

const STORAGE_KEY = "conlang_studio_autosave";

const INITIAL_CONSTRAINTS: ProjectConstraints = {
  allowDuplicates: true,
  caseSensitive: false,
  bannedSequences: [],
  allowedGraphemes: "",
  phonotacticStructure: "",
  mustStartWith: [],
  mustEndWith: [],
};

const INITIAL_SCRIPT: ScriptConfig = {
  name: "Standard Script",
  direction: "ltr",
  glyphs: [],
  spacingMode: "proportional",
};

export const useProject = () => {
  const [projectName, setProjectName] = useState("Untitled");
  const [projectAuthor, setProjectAuthor] = useState("Unknown");
  const [projectDescription, setProjectDescription] = useState("");
  const [lexicon, setLexicon] = useState<LexiconEntry[]>([]);
  const [grammar, setGrammar] = useState("");
  const [morphology, setMorphology] = useState<MorphologyState>({ dimensions: [], paradigms: [] });
  const [phonology, setPhonology] = useState<PhonologyConfig>({
    name: "Default Phonology",
    description: "",
    consonants: [],
    vowels: [],
    syllableStructure: "",
    bannedCombinations: [],
  });
  const [rules, setRules] = useState<SoundChangeRule[]>([]);
  const [constraints, setConstraints] = useState<ProjectConstraints>(INITIAL_CONSTRAINTS);
  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>(INITIAL_SCRIPT);
  const [notebook, setNotebook] = useState("");

  // UI/interaction state for app layout
  const [currentView, setCurrentView] = useState<ViewState>("DASHBOARD");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Version pour forcer le rerender global
  const [version, setVersion] = useState(0);

  // Track if initial load is complete to prevent auto-save before loading
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Integrate app settings via useSettings
  const { settings, updateSettings } = useSettings();

  const loadProjectData = (data: ProjectData) => {
    setProjectName(data.name || "Untitled");
    setProjectAuthor(data.author || "Unknown");
    setProjectDescription(data.description || "");
    setLexicon(data.lexicon || []);
    setGrammar(data.grammar || "");
    setMorphology(data.morphology || { dimensions: [], paradigms: [] });
    setPhonology(data.phonology || {
      name: "Default Phonology",
      description: "",
      consonants: [],
      vowels: [],
      syllableStructure: "",
      bannedCombinations: [],
    });
    setRules(data.evolutionRules || []);
    setScriptConfig(data.scriptConfig || INITIAL_SCRIPT);
    setNotebook(data.notebook || "");
    setConstraints({ ...INITIAL_CONSTRAINTS, ...(data.constraints || {}) });
    setVersion(v => v + 1); // force rerender global
  };

  // Load project from localStorage on mount, or load default Sindarin project
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        loadProjectData(JSON.parse(saved));
        setIsInitialLoadComplete(true);
      } catch (e) {
        console.error("Failed to load project from storage", e);
        setIsInitialLoadComplete(true);
      }
    } else {
      // No saved project, load default Sindarin project
      fetch("/sindarin_complete.json")
        .then(res => res.json())
        .then(data => {
          loadProjectData(data);
          setIsInitialLoadComplete(true);
        })
        .catch(err => {
          console.error("Failed to load default Sindarin project", err);
          setIsInitialLoadComplete(true);
        });
    }
  }, []);

  // Auto-save project to localStorage (skip on initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    
    const projectData: ProjectData = {
      version: "1.1",
      name: projectName,
      author: projectAuthor,
      description: projectDescription,
      lexicon,
      grammar,
      morphology,
      phonology,
      evolutionRules: rules,
      constraints,
      scriptConfig,
      notebook,
      lastModified: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
    } catch (e) {
      console.error("Auto-save failed", e);
    }
  }, [
    isInitialLoadComplete,
    projectName,
    projectAuthor,
    projectDescription,
    lexicon,
    grammar,
    morphology,
    phonology,
    rules,
    constraints,
    scriptConfig,
    notebook,
  ]);

  const getFullProjectData = (): ProjectData => ({
    version: "1.1",
    name: projectName,
    author: projectAuthor,
    description: projectDescription,
    lexicon,
    grammar,
    morphology,
    phonology,
    evolutionRules: rules,
    constraints,
    scriptConfig,
    notebook,
    lastModified: Date.now(),
  });

  // Handlers grouped for cleaner props spreading in App
  const handlers = {
    newProject: (payload?: { name?: string; author?: string; description?: string }) => {
      setProjectName(payload?.name || "Untitled");
      setProjectAuthor(payload?.author || "Unknown");
      setProjectDescription(payload?.description || "");
      setLexicon([]);
      setGrammar("");
      setMorphology({ dimensions: [], paradigms: [] });
      setPhonology({
        name: "Default Phonology",
        description: "",
        consonants: [],
        vowels: [],
        syllableStructure: "",
        bannedCombinations: [],
      });
      setRules([]);
      setConstraints({ ...INITIAL_CONSTRAINTS });
      setScriptConfig(INITIAL_SCRIPT);
      setNotebook("");
      setCurrentView("DASHBOARD");
    },
    exportProject: (fileName?: string) => {
      const data = getFullProjectData();
      const text = JSON.stringify(data, null, 2);
      const blob = new Blob([text], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName || `${projectName || "project"}.json`;
      a.click();
    },
    openProject: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          loadProjectData(JSON.parse(e.target?.result as string));
        };
        reader.readAsText(file);
      };
      input.click();
    },
    openSettings: () => {},
    openProjectSettings: () => setCurrentView("DASHBOARD"),
    openConstraints: () => setCurrentView("DASHBOARD"),
    openConsole: () => {},
    zoomIn: () => {},
    zoomOut: () => {},
    onToggleSidebar: () => {},
    toggleScriptMode: () => {},
    openAbout: () => {},
  };

  const states = {
    // Project metadata
    projectName,
    projectAuthor,
    projectDescription,
    
    // Project data
    lexicon,
    setLexicon,
    grammar,
    setGrammar,
    morphology,
    setMorphology,
    phonology,
    setPhonology,
    rules,
    setRules,
    constraints,
    setConstraints,
    scriptConfig,
    setScriptConfig,
    notebook,
    setNotebook,
    
    // UI settings for ProjectView
    enableAI: settings.enableAI,
    showLineNumbers: settings.showLineNumbers,
    isScriptMode: false,
    setCurrentView,
  };

  const sidebarProps = {
    currentView: currentView as ViewState,
    setView: setCurrentView,
  };

  // Return both legacy fields and the new grouped API to preserve compatibility
  return {
    projectName,
    setProjectName: (v: string) => setProjectName(v),
    projectAuthor,
    setProjectAuthor: (v: string) => setProjectAuthor(v),
    projectDescription,
    setProjectDescription: (v: string) => setProjectDescription(v),
    lexicon,
    setLexicon: (v: SetStateAction<LexiconEntry[]>) => setLexicon(v),
    grammar,
    setGrammar: (v: string) => setGrammar(v),
    morphology,
    setMorphology: (v: MorphologyState) => setMorphology(v),
    phonology,
    setPhonology: (v: PhonologyConfig) => setPhonology(v),
    rules,
    setRules: (v: SetStateAction<SoundChangeRule[]>) => setRules(v),
    constraints,
    setConstraints: (v: ProjectConstraints) => setConstraints(v),
    scriptConfig,
    setScriptConfig: (v: ScriptConfig) => setScriptConfig(v),
    notebook,
    setNotebook: (v: string) => setNotebook(v),
    loadProjectData,
    getFullProjectData,

    // New grouped properties
    settings,
    updateSettings,
    handlers,
    states,
    sidebarProps,
    currentView,
    setCurrentView,
    version,
  };
};
