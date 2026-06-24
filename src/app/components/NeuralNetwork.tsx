import { useEffect, useRef, useState } from "react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  size: number;
  alpha: number;
  color: string;
}

const SKILL_NODES = [
  { text: "Next.js", color: "#60a5fa" }, // Soft blue
  { text: "Django", color: "#38bdf8" }, // Cyan
  { text: "FastAPI", color: "#06b6d4" }, // Deep Cyan
  { text: "React.js", color: "#3b82f6" }, // Blue
  { text: "C++", color: "#10b981" }, // Emerald
  { text: "Spring Boot", color: "#34d399" }, // Light Emerald
  { text: "IoT (ESP32)", color: "#14b8a6" }, // Teal
  { text: "RAG Systems", color: "#0ea5e9" }, // Sky Blue
  { text: "TinyML", color: "#10b981" },
  { text: "Python", color: "#3b82f6" },
  { text: "PostgreSQL", color: "#06b6d4" },
  { text: "Docker", color: "#14b8a6" },
  { text: "Git", color: "#60a5fa" },
];

export function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { topP, theme } = useModelSettings();
  const [isVisible, setIsVisible] = useState(true);

  // Viewport observation to pause loop offscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Canvas render loop
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let h = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.parentElement?.clientWidth || 800;
      h = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const nodes: Node[] = [];
    const isMobile = window.innerWidth < 640;

    // Initialize nodes
    SKILL_NODES.forEach((skill) => {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        label: skill.text,
        size: isMobile ? 3 : 4,
        alpha: Math.random() * 0.2 + 0.7,
        color: skill.color,
      });
    });

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Connect nodes close to each other
      // TopP dynamically controls the connection density
      const maxConnectDist = (isMobile ? 80 : 120) * (topP + 0.35);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = theme === "dark"
              ? `rgba(147, 197, 253, ${alpha})`
              : `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw connection lines to mouse
      if (mouseX !== -9999) {
        nodes.forEach((n) => {
          const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = theme === "dark"
              ? `rgba(147, 197, 253, ${alpha})`
              : `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      }

      // Draw nodes and text labels
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Boundary reflection
        if (n.x < 12 || n.x > w - 12) n.vx *= -1;
        if (n.y < 12 || n.y > h - 12) n.vy *= -1;

        // Node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Skill labels (minimal typography)
        ctx.font = "500 9px var(--font-body)";
        ctx.fillStyle = theme === "dark"
          ? `rgba(255, 255, 255, ${n.alpha})`
          : `rgba(9, 9, 11, ${n.alpha * 0.8})`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 7);
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, topP, theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] bg-black/5 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden select-none flex items-center justify-center"
    >
      <div className="absolute top-4 left-4 text-slate-400/40 text-[8px] font-mono tracking-widest uppercase">
        Skills Flow Mesh // top_p={topP.toFixed(2)}
      </div>
      <div className="absolute bottom-4 right-4 text-slate-400/40 text-[8px] font-mono tracking-widest uppercase">
        Interactive Web
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
      />
    </div>
  );
}
