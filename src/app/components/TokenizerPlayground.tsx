import { useState } from "react";

export function TokenizerPlayground() {
  const [inputText, setInputText] = useState("Engineering the future of AI systems at EMSI Rabat.");
  
  // Simple token segmenter simulation
  const tokens = inputText.split(/(\s+|[.,!?;:()]+)/).filter(Boolean).map((t, idx) => {
    const isWord = t.trim().length > 0;
    // Cyclically assign modern blue/cyan/emerald styling
    const colorClasses = [
      "bg-blue-500/10 border-blue-500/20 text-blue-400 dark:text-blue-300",
      "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 dark:text-cyan-300",
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 dark:text-emerald-300"
    ];
    const styleClass = isWord ? colorClasses[idx % colorClasses.length] : "bg-slate-400/5 border-transparent text-slate-500";
    return { text: t, styleClass, isWord };
  });

  return (
    <div className="w-full bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 font-body shadow-inner select-none h-full justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3 text-[9px] font-mono text-slate-400 tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>OPENAI_TOKENIZER_v2 // INTERACTIVE</span>
          </span>
          <span>LANG: GPT4_BPE</span>
        </div>

        {/* Input box */}
        <textarea
          className="w-full bg-black/30 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-slate-200 outline-none hover:border-blue-500/20 focus:border-blue-500/40 transition-all resize-none font-mono placeholder-slate-600 leading-relaxed"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something to tokenize..."
        />
      </div>

      {/* Output segmented tokens */}
      <div className="flex-1 min-h-[70px] bg-black/10 border border-white/[0.02] rounded-xl p-3 flex flex-wrap gap-1 items-start content-start overflow-y-auto mt-2">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`text-[9px] px-1.5 py-0.5 rounded border font-mono tracking-wide ${t.styleClass}`}
            style={{ whiteSpace: "pre" }}
          >
            {t.text}
          </span>
        ))}
        {tokens.length === 0 && (
          <span className="text-[9px] text-slate-600 font-mono">Tokenizer output...</span>
        )}
      </div>

      {/* Stats counter */}
      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1 text-[9px] font-mono text-slate-400">
        <span>TOKENS: <span className="text-blue-400 font-bold">{tokens.length}</span></span>
        <span>CHARACTERS: <span className="text-cyan-400 font-bold">{inputText.length}</span></span>
      </div>
    </div>
  );
}
