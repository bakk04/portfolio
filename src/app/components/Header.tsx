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
    <div className="flex items-center rounded-full bg-slate-100 dark:bg-white/[0.04] p-0.5 border border-black/5 dark:border-white/[0.06]">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="relative px-2.5 py-0.5 text-[8.5px] font-bold tracking-wider rounded-full uppercase z-10 cursor-pointer"
          style={{
            fontFamily: "var(--font-mono)",
            color: lang === l ? "#ffffff" : "var(--muted-foreground)",
          }}
        >
          {lang === l && (
            <motion.div
              layoutId="headerLang"
              className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full -z-10"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header({ nav, activeSection, onNavigate }: HeaderProps) {
  const { theme, setTheme, lang } = useModelSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const logoMagnetic = useMagnetic(0.15);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-2.5 rounded-full transition-all duration-500 border backdrop-blur-[24px] backdrop-saturate-[1.8] ${
            scrolled
              ? "bg-white/80 dark:bg-[#07070a]/75 border-black/5 dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] scale-[0.98]"
              : "bg-white/40 dark:bg-[#07070a]/35 border-black/5 dark:border-white/[0.04] shadow-sm"
          }`}
          style={{
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
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
              className="flex items-center gap-2.5 py-1.5 px-3.5 rounded-full border border-black/5 dark:border-white/[0.05] bg-white/50 dark:bg-black/30 transition-all duration-300 hover:border-blue-500/30 group cursor-pointer relative overflow-hidden"
              style={{ willChange: "transform" }}
            >
              {/* Spinning Shifting Gradient Badge */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[8.5px] font-black text-white shrink-0 shadow-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 animate-spin-slow scale-110" style={{ animationDuration: '4s' }} />
                <span className="relative z-10">Y</span>
              </div>
              <span
                className="text-[11.5px] font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1 font-display"
              >
                Younes <span className="text-blue-500 font-medium">Bakkali</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {nav.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                onMouseEnter={() => setHoveredNav(id)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`relative px-4 py-1.5 text-[10px] font-bold tracking-wide rounded-full transition-all duration-300 cursor-pointer ${
                  activeSection === id
                    ? "text-slate-950 dark:text-foreground font-extrabold"
                    : "text-slate-500 dark:text-muted-foreground hover:text-slate-950 dark:hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span className="relative z-10">{label}</span>
                
                {/* Active Underline menu animation */}
                {activeSection === id && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-blue-500 dark:bg-blue-400 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}

                {/* Vercel-like hover backdrop capsule */}
                <AnimatePresence>
                  {hoveredNav === id && (
                    <motion.div
                      layoutId="hoverCapsule"
                      className="absolute inset-0 rounded-full bg-slate-100/60 dark:bg-white/[0.04] -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-2">
            <LangPill />

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="w-7.5 h-7.5 rounded-full flex items-center justify-center border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.06] transition-all duration-300 text-slate-600 dark:text-muted-foreground hover:text-slate-950 dark:hover:text-white cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Premium CTA Button "Contact Me" */}
            <button
              onClick={() => handleNav("contact")}
              className="relative hidden sm:flex items-center justify-center h-8 px-4 rounded-full font-mono text-[9px] uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer active:scale-95 z-10 shrink-0 font-bold hover:shadow-lg hover:shadow-blue-500/10 border border-black/10 dark:border-white/10"
            >
              {lang === "en" ? "Contact Me" : "Me Contacter"}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-7.5 h-7.5 rounded-full flex items-center justify-center border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] text-slate-600 dark:text-muted-foreground hover:text-slate-950 dark:hover:text-white cursor-pointer"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[4.8rem] left-6 right-6 z-[99] rounded-2xl border border-black/5 dark:border-white/[0.08] overflow-hidden md:hidden shadow-lg"
            style={{
              background: theme === "dark" ? "rgba(7, 7, 10, 0.92)" : "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {nav.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="w-full px-6 py-3.5 text-left text-xs border-b border-black/5 dark:border-white/[0.04] last:border-0 transition-colors cursor-pointer"
                style={{
                  color: activeSection === id ? "var(--primary)" : "var(--foreground)",
                  fontFamily: "var(--font-body)",
                  opacity: activeSection === id ? 1 : 0.75,
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleNav("contact")}
              className="w-full px-6 py-4 text-center text-xs text-white bg-blue-600 hover:bg-blue-500 font-bold transition-colors cursor-pointer"
            >
              {lang === "en" ? "Contact Me" : "Me Contacter"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
