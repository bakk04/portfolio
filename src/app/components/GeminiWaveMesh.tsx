import { useEffect, useRef, useState } from "react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

interface Wave {
  phase: number;
  speed: number;
  amplitude: number;
  frequency: number;
  color: string;
}

export function GeminiWaveMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { temperature, theme } = useModelSettings();
  const [isVisible, setIsVisible] = useState(true);

  // Track mouse coordinates for wave distortion
  const mouseRef = useRef({ x: -9999, y: -9999, targetX: -9999, targetY: -9999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Smooth inertia tracking for cursor
    let rafId: number;
    const smoothMouse = () => {
      const m = mouseRef.current;
      if (m.targetX !== -9999) {
        if (m.x === -9999) {
          m.x = m.targetX;
          m.y = m.targetY;
        } else {
          m.x += (m.targetX - m.x) * 0.08;
          m.y += (m.targetY - m.y) * 0.08;
        }
      } else {
        m.x = -9999;
        m.y = -9999;
      }
      rafId = requestAnimationFrame(smoothMouse);
    };
    rafId = requestAnimationFrame(smoothMouse);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Viewport Observer to pause rendering when offscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 });

    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  // Canvas render loop
  useEffect(() => {
    if (!isVisible) return;

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

    // Waves parameters (Siri/Gemini style blending curves)
    const waves: Wave[] = [
      { phase: 0, speed: 0.008, amplitude: 50, frequency: 0.004, color: "rgba(59, 130, 246, 0.45)" },   // Blue
      { phase: 2, speed: 0.012, amplitude: 40, frequency: 0.006, color: "rgba(6, 182, 212, 0.5)" },    // Cyan
      { phase: 4, speed: 0.006, amplitude: 60, frequency: 0.003, color: "rgba(16, 185, 129, 0.4)" },   // Emerald
      { phase: 1, speed: 0.015, amplitude: 30, frequency: 0.008, color: "rgba(56, 189, 248, 0.35)" },  // Light Blue
      { phase: 3, speed: 0.01, amplitude: 45, frequency: 0.005, color: "rgba(20, 184, 166, 0.3)" },    // Teal
    ];

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Blending mode for smooth gradient overlaps
      ctx.globalCompositeOperation = theme === "dark" ? "screen" : "multiply";

      const timeSpeedMultiplier = temperature * 1.2;

      waves.forEach((wave) => {
        // Increment phase based on speed and temperature parameter
        wave.phase += wave.speed * timeSpeedMultiplier;

        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = theme === "dark" ? 1.8 : 1.2;

        // Apply blur shadow in dark mode for extra premium glow
        if (theme === "dark") {
          ctx.shadowBlur = 10;
          ctx.shadowColor = wave.color;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw points across the screen width
        const step = 8;
        for (let x = 0; x <= w; x += step) {
          // Base sinus wave
          const baseSine = Math.sin(x * wave.frequency + wave.phase);
          // Amplitude modulation (creates the ribbon thickness variance)
          const mod = Math.cos(x * 0.001 - wave.phase * 0.5) * 0.6 + 0.4;
          
          let y = h / 2 + baseSine * wave.amplitude * mod;

          // Mouse warp distortion (pushes the waves away from the cursor)
          const m = mouseRef.current;
          if (m.x !== -9999) {
            const dx = x - m.x;
            const dist = Math.abs(dx);
            if (dist < 220) {
              const force = (220 - dist) / 220;
              const dy = m.y - h / 2;
              y += dy * force * 0.45; // Warps wave baseline towards cursor y-offset
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Reset composite operation & shadows
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, theme, temperature]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 dark:opacity-50" />
    </div>
  );
}
