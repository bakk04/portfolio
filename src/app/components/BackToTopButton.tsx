import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        setProgress(Math.min((currentScroll / totalScroll) * 100, 100));
        setVisible(currentScroll > 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[997] w-12 h-12 rounded-full border border-blue-500/25 bg-[#030303]/75 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center justify-center text-blue-400 hover:text-white cursor-pointer select-none active:scale-95"
          aria-label="Back to top"
        >
          {/* Progress SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              className="text-slate-700/20"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              cx="18"
              cy="18"
              r="16"
            />
            <circle
              className="text-blue-500 transition-all duration-100"
              strokeWidth="2.5"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - progress}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              cx="18"
              cy="18"
              r="16"
            />
          </svg>
          
          {/* Chevron Up Icon */}
          <svg className="relative z-10 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
