import React, { useState } from "react";
import Dashboard from "./Dashboard";
import PhonologyEditor from "./PhonologyEditor";
import Lexicon from "./Lexicon";
import GrammarEditor from "./GrammarEditor";
import GenEvolve from "./GenEvolve";
import ScriptEditor from "./ScriptEditor";
import Notebook from "./Notebook";
import { ViewState, LexiconEntry } from "../types";
import {
  PhonologyConfig,
  MorphologyState,
  SoundChangeRule,
  ScriptConfig,
  ProjectConstraints,
} from "../types";

interface ProjectViewProps {
  currentView: ViewState;
  // Project metadata
  projectName: string;
  projectAuthor: string;
  projectDescription: string;
  // Project data
  lexicon: LexiconEntry[];
  setLexicon: React.Dispatch<React.SetStateAction<LexiconEntry[]>>;
  grammar: string;
  setGrammar: React.Dispatch<React.SetStateAction<string>>;
  morphology: MorphologyState;
  setMorphology: React.Dispatch<React.SetStateAction<MorphologyState>>;
  phonology: PhonologyConfig;
  setPhonology: React.Dispatch<React.SetStateAction<PhonologyConfig>>;
  rules: SoundChangeRule[];
  setRules: React.Dispatch<React.SetStateAction<SoundChangeRule[]>>;
  constraints: ProjectConstraints;
  scriptConfig: ScriptConfig;
  setScriptConfig: React.Dispatch<React.SetStateAction<ScriptConfig>>;
  notebook: string;
  setNotebook: React.Dispatch<React.SetStateAction<string>>;
  // UI settings
  enableAI?: boolean;
  showLineNumbers?: boolean;
  isScriptMode?: boolean;
  setCurrentView?: (view: ViewState) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  currentView,
  projectName,
  projectAuthor,
  projectDescription,
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
  scriptConfig,
  setScriptConfig,
  notebook,
  setNotebook,
  enableAI = false,
  showLineNumbers = true,
  isScriptMode = false,
  setCurrentView = () => {},
}) => {
  const [genWordState, setGenWordState] = useState<any>(null);
  const [draftEntry, setDraftEntry] = useState<Partial<LexiconEntry> | null>(
    null
  );

  switch (currentView) {
    case "DASHBOARD":
      return (
        <Dashboard
          entries={lexicon}
          projectName={projectName}
          author={projectAuthor}
          description={projectDescription}
          setView={setCurrentView}
          scriptConfig={scriptConfig}
          isScriptMode={isScriptMode}
        />
      );
    case "PHONOLOGY":
      return (
        <PhonologyEditor
          phonology={phonology}
          setData={setPhonology}
          enableAI={enableAI}
        />
      );
    case "LEXICON":
      return (
        <Lexicon
          entries={lexicon}
          setEntries={setLexicon}
          constraints={constraints}
          enableAI={enableAI}
          phonology={phonology}
          genWordState={genWordState}
          setGenWordState={setGenWordState}
          draftEntry={draftEntry}
          setDraftEntry={setDraftEntry}
          scriptConfig={scriptConfig}
          isScriptMode={isScriptMode}
        />
      );
    case "GRAMMAR":
      return (
        <GrammarEditor
          grammar={grammar}
          setGrammar={setGrammar}
          morphology={morphology}
          setMorphology={setMorphology}
          showLineNumbers={showLineNumbers}
          scriptConfig={scriptConfig}
          isScriptMode={isScriptMode}
        />
      );
    case "GENEVOLVE":
      return (
        <GenEvolve
          entries={lexicon}
          onUpdateEntries={setLexicon}
          rules={rules}
          setRules={setRules}
          scriptConfig={scriptConfig}
          isScriptMode={isScriptMode}
        />
      );
    case "SCRIPT":
      return (
        <ScriptEditor
          scriptConfig={scriptConfig}
          setScriptConfig={setScriptConfig}
          constraints={constraints}
        />
      );
    case "NOTEBOOK":
      return (
        <Notebook
          text={notebook}
          setText={setNotebook}
          scriptConfig={scriptConfig}
          isScriptMode={isScriptMode}
        />
      );
    default:
      return null;
  }
};
