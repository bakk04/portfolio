import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AiOrb } from "./AiOrb";
import type { Lang, ChatMessage } from "../types";

// Typewriter text reveal effect with scroll notifications
function StreamingText({
  text,
  onComplete,
  onUpdate,
}: {
  text: string;
  onComplete?: () => void;
  onUpdate?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 8); // Speedy premium stream

    return () => clearInterval(interval);
  }, [text, onComplete]);

  useEffect(() => {
    onUpdate?.();
  }, [displayedText, onUpdate]);

  return (
    <span className="leading-relaxed">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1 h-3.5 bg-blue-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

type AskYounesAiProps = {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  thinking: boolean;
  chips: Array<{ label: string; q: string }>;
};

export function AskYounesAi({
  lang,
  isOpen,
  onClose,
  messages,
  onSend,
  thinking,
  chips,
}: AskYounesAiProps) {
  const [inputValue, setInputValue] = useState("");
  const [completedIndex, setCompletedIndex] = useState<number>(-1);
  
  const messageListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of the message container
  const scrollToBottom = useCallback((behavior: "auto" | "smooth" = "smooth") => {
    if (messageListRef.current) {
      const container = messageListRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Trigger scroll to bottom on message list updates or thinking changes
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, thinking, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || thinking) return;
    onSend(inputValue);
    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: 0.93 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          // Capture scroll interactions inside the chatbot box to prevent body scrolling
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed bottom-24 right-6 z-[999] w-[330px] sm:w-[400px] h-[520px] rounded-3xl flex flex-col overflow-hidden border border-white/10 dark:border-white/5 bg-white/80 dark:bg-black/75 backdrop-blur-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] font-body pointer-events-auto"
        >
          {/* Top visual accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

          {/* Header */}
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-white/20 dark:bg-white/[0.01] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <AiOrb active={thinking} />
              <div>
                <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 tracking-wider font-display">
                  Ask Younes AI
                </h4>
                <p className="text-[8px] text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                  RAG Assistant Engine
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center bg-white/50 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Message List - Scrolls Independently */}
          <div 
            ref={messageListRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative z-10 scrollbar-none"
            style={{
              overscrollBehavior: "contain", // prevent scroll propagation on touchscreens
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1.5 max-w-[85%] ${
                  m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                {/* Modern Chat Bubble Glassmorphism Design */}
                <div
                  className={`text-[11.5px] px-4 py-3 rounded-2xl leading-relaxed border ${
                    m.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 text-white shadow-md shadow-blue-500/10 rounded-tr-none"
                      : "bg-white/60 dark:bg-white/[0.03] border-black/5 dark:border-white/5 text-slate-800 dark:text-slate-100 rounded-tl-none"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {m.sender === "bot" && idx > completedIndex ? (
                    <StreamingText
                      text={m.text}
                      onComplete={() => setCompletedIndex(idx)}
                      onUpdate={() => scrollToBottom("auto")}
                    />
                  ) : (
                    <span>{m.text}</span>
                  )}
                </div>

                {m.source && (
                  <span className="text-[7px] text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 font-mono">
                    Source: {m.source.replace("CV_Younes_Bakkali_Terghi.pdf", "YBT_CV")}
                  </span>
                )}
              </div>
            ))}

            {/* Bouncing Dot Thinking Indicator */}
            {thinking && (
              <div className="flex items-center gap-2 mr-auto bg-white/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">RETRIEVING</span>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Tag Suggestion Chips */}
          <div className="px-4 py-2 flex gap-1.5 overflow-x-auto border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-black/20 scrollbar-none select-none relative z-10 shrink-0">
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => onSend(chip.q)}
                className="shrink-0 text-[8px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border border-black/5 dark:border-white/5 bg-white/80 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-black/5 dark:border-white/5 flex gap-2 bg-white/40 dark:bg-black/40 relative z-10 shrink-0"
          >
            <input
              type="text"
              className="flex-1 bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl px-4 py-2 text-[10px] text-slate-800 dark:text-slate-100 outline-none hover:border-blue-500/20 focus:border-blue-500/50 transition-all placeholder-slate-400 dark:placeholder-slate-500"
              placeholder={lang === "en" ? "Ask about Younes' experience, skills..." : "Poser une question..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={thinking}
            />
            
            <button
              type="submit"
              disabled={thinking}
              className="w-8.5 h-8.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950/40 text-white flex items-center justify-center shadow-md shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
