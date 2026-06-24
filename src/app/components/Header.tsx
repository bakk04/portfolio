import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

type NavItem = { label: string; id: string };

type HeaderProps = {
  nav: NavItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
};

function useMagnetic(strength = 0.2) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  }, []);

  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function LangPill() {
  const { lang, setLang } = useModelSettings();
  return (
    <div className="flex items-center rounded-full bg-slate-900/5 dark:bg-white/[0.04] p-0.5 border border-black/5 dark:border-white/[0.08] shadow-inner shrink-0">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="relative px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-full uppercase z-10 cursor-pointer transition-colors duration-300"
          style={{
            fontFamily: "var(--font-mono)",
            color: lang === l ? "#ffffff" : "var(--muted-foreground)",
          }}
        >
          {lang === l && (
            <motion.div
              layoutId="headerLang"
              className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full -z-10 shadow-sm"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useModelSettings();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-8 h-8 rounded-full flex items-center justify-center border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.04] dark:bg-white/[0.03] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer active:scale-90 transition-colors shadow-sm overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.55)] flex items-center justify-center"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-blue-650 dark:text-blue-400 filter drop-shadow-[0_0_4px_rgba(59,130,246,0.3)] flex items-center justify-center"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-3.5 h-3 flex flex-col justify-between items-center relative">
      <motion.span
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="w-full h-[2px] bg-current rounded-full"
      />
      <motion.span
        animate={open ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        className="w-full h-[2px] bg-current rounded-full"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="w-full h-[2px] bg-current rounded-full"
      />
    </div>
  );
}

export function Header({ nav, activeSection, onNavigate }: HeaderProps) {
  const { theme, lang } = useModelSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const logoMagnetic = useMagnetic(0.12);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4.5 sm:px-6 md:px-12 pointer-events-none"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-4 py-2.5 sm:px-5 sm:py-3 rounded-full transition-all duration-500 border backdrop-blur-[28px] backdrop-saturate-[1.8] ${
            scrolled
              ? "bg-white/85 dark:bg-[#030303]/85 border-slate-200/80 dark:border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] scale-[0.98]"
              : "bg-white/50 dark:bg-[#030303]/50 border-slate-200/40 dark:border-white/[0.04] shadow-sm"
          }`}
          style={{
            WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            willChange: "transform, background-color, border-color",
          }}
        >
          {/* Animated Logo */}
          <div className="flex items-center gap-3">
            <button
              ref={logoMagnetic.ref}
              onMouseMove={logoMagnetic.onMouseMove}
              onMouseLeave={logoMagnetic.onMouseLeave}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 py-1.5 px-3.5 sm:px-4 rounded-full border border-black/[0.04] dark:border-white/[0.05] bg-white/70 dark:bg-black/40 transition-all duration-300 hover:border-blue-500/30 group cursor-pointer relative overflow-hidden shadow-sm"
              style={{ willChange: "transform" }}
            >
              {/* Spinning Shifting Gradient Badge */}
              <div
                className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 animate-spin-slow scale-110" style={{ animationDuration: '6s' }} />
                <span className="relative z-10 font-mono">Y</span>
              </div>
              <span
                className="text-[12px] sm:text-[12.5px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1 font-display"
              >
                Younes <span className="text-blue-500 font-semibold group-hover:text-cyan-400 transition-colors">Bakkali</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 relative bg-slate-900/5 dark:bg-white/[0.02] p-1 rounded-full border border-black/[0.03] dark:border-white/[0.04]">
            {nav.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  onMouseEnter={() => setHoveredNav(id)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative px-4.5 py-2 text-[12.5px] font-semibold tracking-wide rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white dark:text-slate-950 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="relative z-10">{label}</span>
                  
                  {/* Morphing active capsule indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 bg-slate-900 dark:bg-white rounded-full -z-10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Vercel hover capsule */}
                  <AnimatePresence>
                    {hoveredNav === id && !isActive && (
                      <motion.div
                        layoutId="hoverCapsule"
                        className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.04] -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LangPill />
            <ThemeSwitcher />

            {/* Premium CTA Button "Contact Me" */}
            <button
              onClick={() => handleNav("contact")}
              className="relative hidden sm:flex items-center justify-center h-8.5 px-4.5 rounded-full font-mono text-[9.5px] uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer active:scale-95 z-10 shrink-0 font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-black/10 dark:border-white/10"
            >
              {lang === "en" ? "Contact Me" : "Me Contacter"}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.04] dark:bg-white/[0.03] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer active:scale-95"
              aria-label="Menu"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation Dropdown with staggered reveals */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Full screen backdrop blur overlay for mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[98] bg-black/40 dark:bg-black/60 backdrop-blur-md md:hidden pointer-events-auto"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.05,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.4
                  }
                },
                closed: {
                  opacity: 0,
                  y: -12,
                  scale: 0.96,
                  transition: {
                    staggerChildren: 0.04,
                    staggerDirection: -1,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.3
                  }
                }
              }}
              className="fixed top-[4.8rem] left-5 right-5 z-[99] rounded-[24px] border border-slate-200/85 dark:border-white/[0.08] overflow-hidden md:hidden shadow-2xl origin-top"
              style={{
                background: theme === "dark" ? "rgba(3, 3, 3, 0.94)" : "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
              }}
            >
              <div className="flex flex-col p-1.5">
                {nav.map(({ label, id }) => (
                  <motion.button
                    key={id}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -8 }
                    }}
                    onClick={() => handleNav(id)}
                    className="w-full px-5 py-3.5 text-left text-[12.5px] font-bold rounded-xl border-b border-black/[0.02] dark:border-white/[0.02] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                    style={{
                      color: activeSection === id ? "var(--primary)" : "var(--foreground)",
                      fontFamily: "var(--font-display)",
                      opacity: activeSection === id ? 1 : 0.8,
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
                <motion.button
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 8 }
                  }}
                  onClick={() => handleNav("contact")}
                  className="w-full mt-2 px-5 py-4 text-center text-xs.5 text-white bg-blue-600 hover:bg-blue-500 font-bold transition-colors cursor-pointer tracking-wider font-mono uppercase rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
                >
                  {lang === "en" ? "Contact Me" : "Me Contacter"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
