import { useEffect, useRef, useState } from "react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { temperature, theme } = useModelSettings();
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle resize and mouse move
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    let rafId: number;
    const isMobileViewport = window.innerWidth < 768;

    if (!isMobileViewport) {
      // Set initial mouse position in center
      mouseRef.current.x = window.innerWidth / 2;
      mouseRef.current.y = window.innerHeight / 2;
      mouseRef.current.targetX = window.innerWidth / 2;
      mouseRef.current.targetY = window.innerHeight / 2;

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      const smoothMouse = () => {
        const m = mouseRef.current;
        const dx = m.targetX - m.x;
        const dy = m.targetY - m.y;
        m.x += dx * 0.07;
        m.y += dy * 0.07;

        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${m.x - 300}px, ${m.y - 300}px, 0)`;
        }
        rafId = requestAnimationFrame(smoothMouse);
      };

      rafId = requestAnimationFrame(smoothMouse);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isMobileViewport) {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Canvas particle stardust grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const particles: Particle[] = [];
    const count = Math.min(60, Math.floor((w * h) / 28000)); // Adaptive count

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMoveLocal = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMoveLocal, { passive: true });

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw faint connection web
      // Disable connection lines on narrow mobile viewports to boost scroll FPS
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 10000) { // 100 * 100 = 10000
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / 100) * (theme === "dark" ? 0.05 : 0.03);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = theme === "dark" 
                ? `rgba(147, 197, 253, ${alpha})` // Sleek blue/indigo lines
                : `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      }

      // Draw stars and track repulsion
      particles.forEach((p) => {
        // Temperature controls particle movement speeds in real-time
        p.x += p.vx * (temperature * 1.3);
        p.y += p.vy * (temperature * 1.3);

        // Wrap boundaries
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Cursor repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 19600) { // 140 * 140 = 19600
          const dist = Math.sqrt(distSq);
          const force = (140 - dist) / 140;
          p.x -= (dx / (dist || 1)) * force * 1.2;
          p.y -= (dy / (dist || 1)) * force * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === "dark"
          ? `rgba(191, 219, 254, ${p.alpha})` // Light blue stardust
          : `rgba(37, 99, 235, ${p.alpha * 0.7})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMoveLocal);
      cancelAnimationFrame(animationId);
    };
  }, [temperature, theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. Drifting Ambient Gradient auroras (pure GPU-composited CSS transforms) */}
      <div className={`absolute inset-0 filter blur-[100px] transition-opacity duration-500 ${theme === "dark" ? "opacity-20" : "opacity-[0.08]"}`}>
        <div
          className="absolute w-[60vw] h-[60vw] rounded-full top-[-15%] left-[-10%] bg-gradient-to-br from-blue-600/15 via-cyan-500/8 to-transparent"
          style={{
            animation: `aurora-drift-1 ${28 / Math.max(0.1, temperature)}s ease-in-out infinite alternate`,
            willChange: "transform",
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full bottom-[-10%] right-[-5%] bg-gradient-to-tr from-cyan-600/12 via-emerald-600/6 to-transparent"
          style={{
            animation: `aurora-drift-2 ${22 / Math.max(0.1, temperature)}s ease-in-out infinite alternate`,
            willChange: "transform",
          }}
        />
        <div
          className="absolute w-[40vw] h-[40vw] rounded-full top-[25%] left-[35%] bg-gradient-to-r from-blue-500/10 via-cyan-500/4 to-transparent"
          style={{
            animation: `aurora-drift-3 ${32 / Math.max(0.1, temperature)}s ease-in-out infinite alternate`,
            willChange: "transform",
          }}
        />
      </div>

      {/* 2. Soft Mouse Tracking Glow Overlay (Sleek light-source tracking) */}
      {!isMobile && (
        <div
          ref={glowRef}
          className={`absolute w-[600px] h-[600px] rounded-full pointer-events-none filter blur-[80px] transition-opacity duration-500 ${theme === "dark" ? "opacity-100 bg-radial-gradient from-blue-500/4 via-indigo-500/1 to-transparent" : "opacity-30 bg-radial-gradient from-blue-400/8 via-cyan-400/2 to-transparent"}`}
          style={{
            transform: `translate3d(${window.innerWidth / 2 - 300}px, ${window.innerHeight / 2 - 300}px, 0)`,
            willChange: "transform",
          }}
        />
      )}

      {/* 3. Canvas stardust particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50"
      />
    </div>
  );
}
