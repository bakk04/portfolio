import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function PreloaderModern({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 200);
      }
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center text-white select-none overflow-hidden font-body">
      {/* 1. Large, extremely soft background glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-600/10 via-cyan-600/10 to-transparent filter blur-[80px]" />

      <div className="flex flex-col items-center max-w-xs px-6 w-full text-center relative z-10 gap-6">
        {/* 2. Sleek Gemini-style animated orb */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 filter blur-[4px]"
            animate={{
              scale: [1, 1.12, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-1.5 rounded-full bg-[#030303] flex items-center justify-center text-[10px] font-bold font-mono tracking-widest text-slate-300">
            YBT
          </div>
        </div>

        {/* 3. Title info */}
        <div>
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-slate-200 font-mono mb-1">
            Younes Bakkali Terghi
          </h2>
          <p className="text-[9px] text-slate-400 tracking-[0.1em] font-mono">
            Systems & AI Engineer
          </p>
        </div>

        {/* 4. Thin, elegant progress bar */}
        <div className="w-full">
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
            <span>LOADING MODULES</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 5. Minimalist skip link */}
        <button
          onClick={onComplete}
          className="text-[9px] font-mono tracking-wider text-slate-500 hover:text-cyan-400 hover:underline transition-colors mt-2 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}
