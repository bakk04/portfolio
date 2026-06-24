import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function PreloaderModern({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  const logs = [
    "INITIALIZING NEURAL PROTOCOLS...",
    "ESTABLISHING SECURITY SHIELDS... [OK]",
    "MOUNTING DATA PIPELINES // RAG CORE...",
    "CONNECTING EDGE COMPUTATION NODES... [OK]",
    "PORTAL COMPILATION STABLE // DECRYPTING KEY...",
    "INTERFACE ONLINE. WELCOME TO THE FUTURE."
  ];

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      // Increment log messages sequentially
      const currentLogIdx = Math.min(Math.floor((pct / 100) * logs.length), logs.length - 1);
      setLogIdx(currentLogIdx);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center text-white select-none overflow-hidden font-body"
    >
      {/* Cyber matrix background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-50" />
      
      {/* Pulsing energy auroras */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-radial-gradient from-blue-600/10 via-cyan-500/3 to-transparent blur-[90px] animate-pulse pointer-events-none" />

      <div className="flex flex-col items-center max-w-sm px-6 w-full text-center relative z-10 gap-8">
        
        {/* Activating AI Portal Core (Nested Glowing Rings) */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          
          {/* Outer rotating neon ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle spinning segmented ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-double border-blue-500/20 border-t-blue-500/80 border-b-cyan-400/80"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner glowing pulse sphere */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center text-[11px] font-black font-mono tracking-[0.2em] text-white"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.85, 1, 0.85]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            YBT
          </motion.div>
        </div>

        {/* Cinematic Glitch Boot text */}
        <div className="min-h-[48px] flex flex-col items-center justify-center">
          <h2 className="text-[9.5px] font-mono font-bold tracking-[0.3em] uppercase text-cyan-400 mb-1.5 animate-pulse">
            // NEURAL CORE APERTURE //
          </h2>
          <p className="text-[10px] text-slate-350 font-mono tracking-wider font-semibold">
            {logs[logIdx]}
          </p>
        </div>

        {/* Sleek horizontal progress loading bar */}
        <div className="w-full">
          <div className="w-full h-0.75 bg-white/5 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 font-bold tracking-wider">
            <span>DATAPACK LOADING SEQUENCE</span>
            <span className="text-cyan-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Quick Skip button */}
        <button
          onClick={onComplete}
          className="text-[9px] font-mono tracking-widest text-slate-500 hover:text-cyan-400 hover:underline transition-colors mt-2 cursor-pointer uppercase font-bold"
        >
          [ Skip Neural boot ]
        </button>
        
      </div>
    </motion.div>
  );
}
