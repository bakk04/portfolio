import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AiOrb } from "./AiOrb";
import type { Lang, ChatMessage } from "../types";

// Typewriter text reveal effect
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
    }, 6);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  useEffect(() => {
    onUpdate?.();
  }, [displayedText, onUpdate]);

  return (
    <span className="leading-relaxed font-body">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse" />
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
  const [isMobile, setIsMobile] = useState(false);

  // Resize listener for mobile viewport snapping drawer
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = useCallback((behavior: "auto" | "smooth" = "smooth") => {
    if (messageListRef.current) {
      const container = messageListRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, thinking, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || thinking) return;
    onSend(inputValue);
    setInputValue("");
  };

  const animVariants = {
    initial: isMobile 
      ? { y: "100%", opacity: 0.8 } 
      : { opacity: 0, y: 40, scale: 0.92, filter: "blur(6px)" },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      filter: isMobile ? "none" : "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 30 } 
    },
    exit: isMobile 
      ? { y: "100%", opacity: 0 } 
      : { opacity: 0, y: 40, scale: 0.92, filter: "blur(6px)" }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay for chatbot modal on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998] bg-black/40 dark:bg-black/60 backdrop-blur-md sm:hidden pointer-events-auto"
            onClick={onClose}
          />

          {/* Custom style overrides to eliminate scrollbars and design scroll paths */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none !important;
            }
            .hide-scrollbar {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            .chat-scroll-area::-webkit-scrollbar {
              width: 3px !important;
            }
            .chat-scroll-area::-webkit-scrollbar-track {
              background: transparent !important;
            }
            .chat-scroll-area::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.2) !important;
              border-radius: 10px !important;
            }
            .chat-scroll-area::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.45) !important;
            }
          `}</style>

          <motion.div
            variants={animVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 sm:bottom-24 sm:right-6 sm:left-auto z-[999] w-full sm:w-[410px] h-[82dvh] sm:h-[540px] rounded-t-[32px] sm:rounded-[32px] rounded-b-none sm:rounded-b-[32px] flex flex-col overflow-hidden border-t sm:border border-slate-200/80 dark:border-white/[0.06] bg-white/85 dark:bg-[#030303]/85 backdrop-blur-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.7)] font-body pointer-events-auto"
          >
            {/* Cyberpunk ambient rotating backdrop glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
              <div className="absolute w-[200px] h-[200px] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[60px] top-[-10%] right-[-10%] animate-pulse" />
              <div className="absolute w-[220px] h-[220px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/8 blur-[70px] bottom-[10%] left-[-15%]" />
            </div>

            {/* Top color border */}
            <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            {/* Header */}
            <div className="p-4 sm:p-4.5 border-b border-black/[0.05] dark:border-white/[0.05] bg-white/30 dark:bg-black/30 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-[-4px] rounded-full bg-blue-500/15 blur-[6px] animate-pulse" />
                  <AiOrb active={thinking} />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-slate-800 dark:text-slate-100 tracking-wide font-display">
                    Ask Younes AI
                  </h4>
                  <p className="text-[8.5px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping" />
                    RAG Assistant Core
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 z-20"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Message List area - custom webkit scrollbar */}
            <div 
              ref={messageListRef}
              className="flex-1 overflow-y-auto p-4 sm:p-4.5 flex flex-col gap-4 relative z-10 chat-scroll-area"
              style={{ overscrollBehavior: "contain" }}
            >
              {messages.map((m, idx) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1.5 max-w-[85%] ${
                      isUser ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    {/* Modern glassmorphic chat bubbles */}
                    <div
                      className={`text-[12px] px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-[22px] leading-relaxed border shadow-sm ${
                        isUser
                          ? "bg-gradient-to-br from-blue-600/90 to-indigo-600/90 border-blue-500/35 text-white shadow-blue-500/10 rounded-tr-none"
                          : "bg-slate-900/5 dark:bg-white/[0.03] border-slate-200/50 dark:border-white/[0.05] text-slate-800 dark:text-slate-100 rounded-tl-none backdrop-blur-md"
                      }`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {!isUser && idx > completedIndex ? (
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
                      <span className="text-[7.5px] text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-900/5 dark:bg-white/[0.04] border border-black/[0.03] dark:border-white/[0.04] font-mono">
                        🎯 Source: {m.source.replace("CV_Younes_Bakkali_Terghi.pdf", "YBT_CV")}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Bouncing Thinking Indicator */}
              {thinking && (
                <div className="flex items-center gap-3.5 mr-auto bg-slate-900/5 dark:bg-white/[0.02] border border-slate-250/50 dark:border-white/[0.04] px-4.5 py-3.5 rounded-[22px] rounded-tl-none">
                  <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase animate-pulse">// RETRIEVING DATA</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Tag Suggestion Chips (Scrollbar hidden) */}
            <div className="px-4 py-2 sm:px-4.5 sm:py-2.5 flex gap-2 overflow-x-auto border-t border-black/[0.04] dark:border-white/[0.04] bg-slate-500/5 dark:bg-black/35 hide-scrollbar select-none relative z-10 shrink-0">
              {chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onSend(chip.q)}
                  className="shrink-0 text-[8.5px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-full border border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#07070a]/40 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3.5 border-t border-black/[0.04] dark:border-white/[0.04] flex gap-2 bg-white/40 dark:bg-[#030303]/40 relative z-10 shrink-0"
            >
              <input
                type="text"
                className="flex-1 bg-slate-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 text-[11px] text-slate-800 dark:text-slate-100 outline-none hover:border-blue-500/20 focus:border-blue-500/50 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                placeholder={lang === "en" ? "Query credentials, skills, projects..." : "Rechercher compétences, stage..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={thinking}
              />
              
              <button
                type="submit"
                disabled={thinking}
                className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950/40 text-white flex items-center justify-center shadow-md shadow-blue-500/15 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
