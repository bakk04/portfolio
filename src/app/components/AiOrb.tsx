import { motion } from "motion/react";

type AiOrbProps = {
  active?: boolean;
};

export function AiOrb({ active = false }: AiOrbProps) {
  const pathVariants = {
    idle: {
      d: [
        "M 50,16 C 68,18 80,30 84,50 C 88,70 68,80 50,84 C 32,88 16,70 18,50 C 20,30 32,14 50,16 Z",
        "M 50,20 C 70,26 80,20 78,50 C 76,80 62,80 50,80 C 38,80 26,76 22,50 C 18,24 30,14 50,20 Z",
        "M 50,16 C 68,18 80,30 84,50 C 88,70 68,80 50,84 C 32,88 16,70 18,50 C 20,30 32,14 50,16 Z",
      ],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }
    },
    thinking: {
      d: [
        "M 50,14 C 70,12 82,25 80,50 C 78,75 72,78 50,84 C 28,82 18,72 16,50 C 14,28 30,16 50,14 Z",
        "M 50,18 C 78,18 80,32 80,50 C 80,68 68,80 50,80 C 32,80 20,68 20,50 C 20,32 22,18 50,18 Z",
        "M 50,14 C 70,12 82,25 80,50 C 78,75 72,78 50,84 C 28,82 18,72 16,50 C 14,28 30,16 50,14 Z",
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div className="relative w-10 h-10 flex items-center justify-center select-none pointer-events-none">
      {/* 1. Backdrop Glow Layer */}
      <motion.div
        className="absolute inset-[-4px] rounded-full blur-[8px]"
        animate={{
          background: active
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(34, 211, 238, 0.15) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)",
          scale: active ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: active ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 2. SVG Morphing Shape */}
      <svg
        viewBox="0 0 100 100"
        className="w-8 h-8 filter drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]"
      >
        <defs>
          <linearGradient id="geminiOrbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Electric Blue */}
            <stop offset="50%" stopColor="#06b6d4" /> {/* Cyan */}
            <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
          </linearGradient>
          <linearGradient id="geminiThinkingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
            <stop offset="100%" stopColor="#34d399" /> {/* Emerald */}
          </linearGradient>
        </defs>

        <motion.path
          d="M 50,16 C 68,18 80,30 84,50 C 88,70 68,80 50,84 C 32,88 16,70 18,50 C 20,30 32,14 50,16 Z"
          fill={active ? "url(#geminiThinkingGradient)" : "url(#geminiOrbGradient)"}
          variants={pathVariants}
          animate={active ? "thinking" : "idle"}
        />
      </svg>
    </div>
  );
}
