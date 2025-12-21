import React, { useState, useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'bnf' | 'json'; // Extensible for future
  placeholder?: string;
  showLineNumbers?: boolean; // NEW PROP
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language = 'bnf', placeholder, showLineNumbers = true }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Sync scroll between textarea and syntax highlighter
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    setLineCount(value.split('\n').length);
  }, [value]);

  // --- LEXICAL TOKENIZER FOR BNF ---
  // A lightweight lexer to identify tokens for syntax highlighting
  const highlightBNF = (code: string) => {
    if (!code) return <span className="text-slate-600 italic">{placeholder}</span>;

    // We split by tokens but keep delimiters to reconstruct the string
    // Tokens: Strings ("..."), Operators (::=, |), Non-Terminals (Word), Comments
    const tokens = code.split(/(".*?"|'.*?'|::=|\||[\w-]+|<\w+>|;.*)/g);

    return tokens.map((token, i) => {
      if (!token) return null;

      // 1. Strings (Terminals) - e.g. "dog"
      if (token.startsWith('"') || token.startsWith("'")) {
        return <span key={i} className="text-emerald-400 font-bold">{token}</span>;
      }
      
      // 2. Operators - ::= or |
      if (token === '::=' || token === '|') {
        return <span key={i} className="text-pink-500 font-bold">{token}</span>;
      }

      // 3. Comments (assuming ; for BNF comments if supported, or generic)
      if (token.startsWith(';')) {
        return <span key={i} className="text-slate-500 italic">{token}</span>;
      }

      // 4. Non-Terminals (Generic words mostly)
      // If it looks like a PascalCase or camelCase word, it's likely a Non-Terminal
      if (/^[A-Za-z][\w-]*$/.test(token)) {
         return <span key={i} className="text-blue-400">{token}</span>;
      }
      
      // 5. Explicit Non-Terminals <Name>
      if (/^<.+>$/.test(token)) {
         return <span key={i} className="text-blue-400 font-bold">{token}</span>;
      }

      // Whitespace and others
      return <span key={i} className="text-slate-300">{token}</span>;
    });
  };

  return (
    <div className="relative flex h-full font-mono text-sm bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
      
      {/* Sidebar: Line Numbers (Conditionally Rendered) */}
      {showLineNumbers && (
        // CHANGED: border-r -> border-e, text-right -> text-end, pr-3 -> pe-3 for RTL support
        <div className="w-10 bg-slate-900 border-e border-slate-800 text-end py-4 pe-3 text-slate-600 select-none flex flex-col items-end leading-6 overflow-hidden">
            {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
            ))}
        </div>
      )}

      {/* Editor Container */}
      <div className="relative flex-1 overflow-hidden">
        
        {/* Layer 1: Syntax Highlighter (Visuals) */}
        {/* Pointer events none ensures clicks go through to textarea */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 p-4 m-0 bg-transparent pointer-events-none whitespace-pre overflow-hidden leading-6 font-mono text-start"
        >
          {highlightBNF(value)}
          <br /> {/* Extra break to prevent scroll cutoff */}
        </pre>

        {/* Layer 2: Input Area (Interaction) */}
        {/* Transparent text, caret visible. This captures the typing. */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-white resize-none outline-none leading-6 font-mono whitespace-pre overflow-auto z-10 selection:bg-blue-500/30 text-start"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
      
      {/* Status Bar / Footer for the Editor */}
      {/* CHANGED: right-4 -> end-4 for RTL positioning */}
      <div className="absolute bottom-2 end-4 bg-slate-800/80 backdrop-blur text-[10px] text-slate-400 px-2 py-0.5 rounded border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        BNF MODE
      </div>
    </div>
  );
};

export default CodeEditor;