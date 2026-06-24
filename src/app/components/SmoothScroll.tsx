import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { LenisContext } from "../contexts/LenisContext";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let animationFrameId = 0;
    let lenis: Lenis | null = null;

    try {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
        infinite: false,
      });

      lenisRef.current = lenis;
      setLenisInstance(lenis);

      const raf = (time: number) => {
        lenis?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };

      animationFrameId = requestAnimationFrame(raf);
    } catch (error) {
      console.warn("Lenis init failed — native scroll fallback.", error);
    }

    return () => {
      lenis?.destroy();
      cancelAnimationFrame(animationFrameId);
      setLenisInstance(null);
    };
  }, []);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}

/** Scroll to element — uses Lenis when available. */
export function scrollToSection(id: string, lenis: Lenis | null) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -100, duration: 1.6 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
