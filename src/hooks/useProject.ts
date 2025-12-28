import { useState, useEffect } from "react";
import {
  LexiconEntry,
  MorphologyState,
  PhonologyConfig,
  SoundChangeRule,
  ProjectConstraints,
  ScriptConfig,
  ProjectData,
} from "../types";

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
  };

  // Load project from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        loadProjectData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load project from storage", e);
      }
    }
  }, []);

  // Auto-save project to localStorage
  useEffect(() => {
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

  return {
    projectName,
    setProjectName,
    projectAuthor,
    setProjectAuthor,
    projectDescription,
    setProjectDescription,
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
    loadProjectData,
    getFullProjectData,
  };
};
