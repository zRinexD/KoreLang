import React, { useState } from "react";
import Dashboard from "./Dashboard";
import PhonologyEditor from "./PhonologyEditor";
import Lexicon from "./Lexicon";
import GrammarEditor from "./GrammarEditor";
import GenEvolve from "./GenEvolve";
import ScriptEditor from "./ScriptEditor";
import Notebook from "./Notebook";
import { ViewState, LexiconEntry } from "../types";
import { useProjectContext } from "../state/ProjectContext";
import {
  PhonologyConfig,
  MorphologyState,
  SoundChangeRule,
  ScriptConfig,
  ProjectConstraints,
} from "../types";

// Les props sont désormais inutiles, tout passe par le contexte

interface ProjectViewProps {
  isScriptMode?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ isScriptMode = false }) => {
  const {
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
    setCurrentView = () => {},
    settings,
  } = useProjectContext();
  // Pour l’UI, on prend les settings du projet
  const enableAI = settings?.enableAI ?? false;
  const showLineNumbers = settings?.showLineNumbers ?? true;
  // isScriptMode is now passed as a prop from App
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
          setEntries={(v) => setLexicon(typeof v === 'function' ? v(lexicon) : v)}
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
