import { useEffect, useRef } from "react";
import { useLenis } from "../contexts/LenisContext";

type ParallaxLayerProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
};

/** Scroll-linked parallax using Lenis — updates transform only (GPU). */
export function ParallaxLayer({ children, speed = 0.15, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el || !lenis) return;

    const onScroll = ({ scroll }: { scroll: number }) => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scroll) * speed;
      el.style.transform = `translate3d(0, ${offset * -0.1}px, 0)`;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
