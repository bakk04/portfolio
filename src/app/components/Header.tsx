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
          className="relative px-2 py-0.5 text-[8.5px] font-bold tracking-wider rounded-full uppercase z-10 cursor-pointer"
          style={{
            fontFamily: "var(--font-mono)",
            color: lang === l 
              ? "#ffffff" 
              : "var(--muted-foreground)",
          }}
        >
          {lang === l && (
            <motion.div
              layoutId="headerLang"
              className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header({
  nav,
  activeSection,
  onNavigate,
}: HeaderProps) {
  const { theme, setTheme } = useModelSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoMagnetic = useMagnetic(0.18);

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
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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
            willChange: "transform, background-color, border-color"
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              ref={logoMagnetic.ref}
              onMouseMove={logoMagnetic.onMouseMove}
              onMouseLeave={logoMagnetic.onMouseLeave}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors duration-300 group cursor-pointer pr-3 pl-1.5"
              style={{ willChange: "transform" }}
            >
              <div
                className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  fontFamily: "var(--font-display)",
                }}
              >
                YBT
              </div>
              <span
                className="text-[11px] font-extrabold tracking-tight text-slate-800 dark:text-slate-100"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Younes Bakkali
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`relative px-3.5 py-1.5 text-[10px] font-bold tracking-wide rounded-full transition-all duration-300 cursor-pointer ${
                  activeSection === id
                    ? "text-slate-950 dark:text-foreground font-extrabold"
                    : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
                {activeSection === id && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-slate-100/80 dark:bg-white/[0.05] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-2">
            <LangPill />

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="w-7 h-7 rounded-full flex items-center justify-center border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.06] transition-all duration-300 text-slate-600 dark:text-muted-foreground hover:text-slate-950 dark:hover:text-white cursor-pointer"
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

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-7 h-7 rounded-full flex items-center justify-center border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.03] text-slate-600 dark:text-muted-foreground hover:text-slate-950 dark:hover:text-white cursor-pointer"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
