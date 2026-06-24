import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Parallax motion tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates for parallax effect
  const parallaxX1 = useTransform(smoothX, [-300, 300], [-15, 15]);
  const parallaxY1 = useTransform(smoothY, [-300, 300], [-15, 15]);
  const parallaxX2 = useTransform(smoothX, [-300, 300], [25, -25]);
  const parallaxY2 = useTransform(smoothY, [-300, 300], [25, -25]);
  const parallaxX3 = useTransform(smoothX, [-300, 300], [-35, 35]);
  const parallaxY3 = useTransform(smoothY, [-300, 300], [35, -35]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  // 3D Sphere Network Node Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = 450);
    let h = (canvas.height = 450);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.parentElement?.clientWidth || 450;
      h = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Generate nodes on a sphere
    const nodeCount = 55;
    const nodes: Node3D[] = [];
    const radius = 140;

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral distribution on a sphere
      const theta = Math.acos(-1 + (2 * i) / nodeCount);
      const phi = Math.sqrt(nodeCount * Math.PI) * theta;

      nodes.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        px: 0,
        py: 0,
      });
    }

    // Floating particles (background space dust)
    const particles: Array<{ x: number; y: number; z: number; speed: number; size: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 400,
        speed: Math.random() * 0.4 + 0.1,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let angleY = 0.003; // Auto-rotation speed Y
    let angleX = 0.002; // Auto-rotation speed X

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const fov = 350; // Camera perspective field of view

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Rotate and Project Sphere Nodes
      nodes.forEach((n) => {
        // Rotate Y
        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.z * cosY + n.x * sinY;

        // Rotate X
        let y2 = n.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + n.y * sinX;

        // Store back rotated coordinates
        n.x = x1;
        n.y = y2;
        n.z = z2;

        // Perspective Projection
        const scale = fov / (fov + z2);
        n.px = centerX + x1 * scale;
        n.py = centerY + y2 * scale;
      });

      // Update and Draw background space particles
      particles.forEach((p) => {
        // Drifts in Z
        p.z -= p.speed;
        if (p.z < -200) p.z = 200;

        // Rotate Y slightly
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        const scale = fov / (fov + z1);
        const px = centerX + x1 * scale;
        const py = centerY + p.y * scale;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const alpha = (200 - z1) / 400 + 0.2;
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.35})`;
          ctx.fill();
        }
      });

      // Connect Sphere Nodes with Glowing Lines
      ctx.lineWidth = 0.75;
      const maxDist = 95;
      const isDark = document.documentElement.classList.contains("dark");

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z);

          if (dist < maxDist) {
            // Gradient opacity based on depth (z coordinate) and distance
            const avgZ = (n1.z + n2.z) / 2;
            const depthAlpha = (140 - avgZ) / 280; // closer nodes (negative Z) are brighter
            const distAlpha = 1 - dist / maxDist;
            const finalAlpha = Math.max(0, Math.min(1, depthAlpha * distAlpha * 0.45));

            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);

            // Glowing style
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${finalAlpha})`
              : `rgba(37, 99, 235, ${finalAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Sphere Node Dots
      nodes.forEach((n) => {
        const depthAlpha = (140 - n.z) / 280;
        const scale = fov / (fov + n.z);
        const dotSize = Math.max(1, (n.z < 0 ? 3.5 : 1.8) * scale);

        ctx.beginPath();
        ctx.arc(n.px, n.py, dotSize, 0, Math.PI * 2);

        // Gradient node colors based on depth
        if (n.z < -60) {
          ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb"; // Foreground nodes
        } else if (n.z > 60) {
          ctx.fillStyle = isDark ? "#1e293b" : "#cbd5e1"; // Background nodes
        } else {
          ctx.fillStyle = isDark ? "#06b6d4" : "#0284c7"; // Midground nodes
        }

        ctx.fill();

        // Node Glow for closest nodes
        if (n.z < -90) {
          ctx.beginPath();
          ctx.arc(n.px, n.py, dotSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.15)" : "rgba(37, 99, 235, 0.1)";
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Custom SVGs for official technology logos
  const techLogos = {
    react: (
      <svg className="w-6 h-6 text-[#61DAFB]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M90 50c0-3-1.6-6-4.3-8.8-4.5-4.8-11.8-8-20.5-9.3-5-6-10.4-11-15-14.8-2.6-2.1-5-3.8-7-4.8-1.5-.7-2.6-1-3.2-1-.6 0-1.7.3-3.2 1-2.1 1-4.5 2.7-7 4.8-4.7 3.8-10 8.8-15 14.8-8.7 1.3-16 4.5-20.5 9.3C1.6 44 0 47 0 50s1.6 6 4.3 8.8c4.5 4.8 11.8 8 20.5 9.3 5 6 10.4 11 15 14.8 2.6 2.1 5 3.8 7 4.8 1.5.7 2.6 1 3.2 1 .6 0 1.7-.3 3.2-1 2.1-1 4.5-2.7 7-4.8 4.7-3.8 10-8.8 15-14.8 8.7-1.3 16-4.5 20.5-9.3 2.6-2.8 4.2-5.8 4.2-8.8zm-40 8c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-26.6-8c.3-2.6 1-5.2 2-7.8 2.5 1.5 5 3.1 7.7 4.8-3.3 1-6.6 2-9.7 3zm5.6-17.8c3.2-3.8 6.7-7.3 10-10.3 2 1.3 4 2.8 6 4.4-6.4 5.3-11.8 11-16 16.5-1.5-2-3-4-4.5-6.2zm21-12.2c2.1-1.3 4-2.2 5.5-2.7 1.5.5 3.4 1.4 5.5 2.7-2.8 2.2-5.7 4.7-8.5 7.4-2.8-2.7-5.7-5.2-8-7.4zm15.4 1.9c3.3 3 6.8 6.5 10 10.3-1.5 2.2-3 4.2-4.5 6.2-4.2-5.5-9.6-11.2-16-16.5 2-1.6 4-3.1 6-4.4zm5.6 17.8c1 2.6 1.7 5.2 2 7.8-3.1-1-6.4-2-9.7-3 2.7-1.7 5.2-3.3 7.7-4.8zm3.2 12c-3.1 1-6.4 2-9.7 3 1 2.6 1.7 5.2 2 7.8 2.5-1.5 5-3.1 7.7-4.8zm-5.6 17.8c-3.2 3.8-6.7 7.3-10 10.3-2-1.3-4-2.8-6-4.4 6.4-5.3 11.8-11 16-16.5 1.5 2 3 4 4.5 6.2zm-21 12.2c-2.1 1.3-4 2.2-5.5 2.7-1.5-.5-3.4-1.4-5.5-2.7 2.8-2.2 5.7-4.7 8.5-7.4 2.8 2.7 5.7 5.2 8 7.4zm-15.4-1.9c-3.3-3-6.8-6.5-10-10.3 1.5-2.2 3-4.2 4.5-6.2 4.2 5.5 9.6 11.2 16 16.5-2 1.6-4 3.1-6 4.4zm-5.6-17.8c-1-2.6-1.7-5.2-2-7.8 3.1 1 6.4 2 9.7 3-2.7 1.7-5.2 3.3-7.7 4.8zm-3.2-12c3.1-1 6.4-2 9.7-3-1-2.6-1.7-5.2-2-7.8-2.5 1.5-5 3.1-7.7 4.8z" />
      </svg>
    ),
    nextjs: (
      <svg className="w-6 h-6 text-foreground" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm27.8 77.2L50 41.5V75H43V25h6.5l22 28.5V25h7v52.2h-.7z" />
      </svg>
    ),
    spring: (
      <svg className="w-6 h-6 text-[#6DB33F]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M96 46c-2-8-8.2-15.4-16-21C64.6 14 43.6 14.5 30 25c-9.2 7-14.8 17.6-15.3 28-.3 6.8 1.4 13 4.8 18 1 .8 3 .2 3.6-1 .4-1.2.6-2.5.7-3.7-.3-10.2 4.2-20.5 12.2-27.5 11.6-10 29.5-10.6 42.4-1.3 5 3.6 8.7 8.5 10.4 13.5 2 5.5 1.5 11-.6 15.6-3 6.8-9.4 11.4-17.2 12.3-5 .6-10.5.2-15-1.5l-3.3 8.3c8 3.5 17.8 4 27.2 1.3 12.7-3.5 22.2-13.4 25-26 1-5 1-10.5-.7-16.5zM22.3 84.7c15.6 14.7 40.5 14.2 55.4-1 9-9.2 13-21.4 11.6-32.5-.8-6.7-3.8-12.7-8.3-17.2-1.2-1.2-3-.5-3.2 1.2v2.5c.3 10.2-4.2 20.5-12 27.5-11.6 10-29.6 10.6-42.5 1.4-5.2-3.7-9-8.5-10.6-13.5-2-5.5-1.5-11.2.6-15.8 3.3-7 9.8-11.6 17.7-12.3 5-.5 10.4-.2 14.8 1.6l3.3-8.3C62 5 52.2 4.4 42.8 7 30 10.7 20.6 20.6 17.8 33c-1.2 5.2-1 10.7.8 16.7 2 8.2 8 15.6 15.8 21.3 15.4 11 36.4 10.5 50-1 9-9.2 14-20 14.6-30 .3-6.6-1.5-13-4.8-17.8-1-.8-3-.2-3.5 1-.4 1.2-.6 2.4-.6 3.6.3 10.2-4.3 20.5-12.3 27.5-11.7 10-29.6 10.6-42.5 1.4-5-3.6-8.7-8.5-10.4-13.5-2-5.5-1.5-11.2.6-15.8 3-6.8 9.5-11.4 17.3-12.3 5-.6 10.5-.2 15 1.5L62.7 13c-8-3.5-17.8-4-27.2-1.3-12.7 3.5-22.2 13.4-25 26-1 5.2-1 10.7.7 16.7 2.2 8.2 8.3 15.5 16 21 15.6 11 36.7 10.5 50.3-1z" />
      </svg>
    ),
    nodejs: (
      <svg className="w-6 h-6 text-[#339933]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M46.4 10.3c2.2-1.3 4.9-1.3 7.1 0l31 17.9c2.2 1.3 3.6 3.6 3.6 6.1v35.8c0 2.5-1.3 4.8-3.6 6.1l-31 17.9c-2.2 1.3-4.9 1.3-7.1 0l-31-17.9c-2.2-1.3-3.6-3.6-3.6-6.1v-35.8c0-2.5 1.3-4.8 3.6-6.1l31-17.9zM50 20L19.5 37.6V72.4L50 90l30.5-17.6V37.6L50 20z" />
      </svg>
    ),
    docker: (
      <svg className="w-6 h-6 text-[#2496ED]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M96.7 42.1c-.8-3.8-3.5-6.5-8-6.5h-5.2c-.3 0-.6.1-.9.3-1.6 1-3.6 1.6-5.8 1.6-5.4 0-9.8-4.4-9.8-9.8 0-1.8.5-3.5 1.4-5-.6-.5-1.3-.8-2.1-.8h-7.6c-.6 0-1.2.5-1.2 1.2v35.8c0 .6.5 1.2 1.2 1.2h44c.6 0 1.2-.5 1.2-1.2V51c.3-3.2 0-6.4-3.2-8.9zm-50.6 5.8H39c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2zm0-11.9H39c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2zm0-12H39c-.6 0-1.2-.5-1.2-1.2V15.7c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2V24c0 .7-.6 1.2-1.2 1.2zm11.9 23.9h-7.1c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2H58c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.5 1.2-1.2 1.2zm0-11.9h-7.1c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2H58c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.5 1.2-1.2 1.2zm0-12h-7.1c-.6 0-1.2-.5-1.2-1.2V15.7c0-.6.5-1.2 1.2-1.2H58c.6 0 1.2.5 1.2 1.2V24c0 .7-.5 1.2-1.2 1.2zm11.9 23.9h-7.1c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2zm0-11.9h-7.1c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2zm12 11.9h-7.1c-.6 0-1.2-.5-1.2-1.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2z" />
      </svg>
    ),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[450px] mx-auto flex items-center justify-center pointer-events-auto"
    >
      {/* Glow gradient backdrops behind the sphere */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-cyan-500/3 to-transparent blur-2xl rounded-full scale-90 pointer-events-none" />

      {/* Rotating Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 block pointer-events-none select-none"
      />

      {/* Interactive Hover Tooltips */}
      {hoveredIcon && (
        <div className="absolute top-[8%] px-4 py-1.5 rounded-full border border-blue-500/30 bg-white/80 dark:bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-widest font-mono text-blue-500 font-bold z-30 transition-all duration-300 animate-pulse">
          {hoveredIcon} active
        </div>
      )}

      {/* Floating HTML Technology Badges - Layered & Positioned with Parallax */}
      {/* 1. React Logo (Top Left) */}
      <motion.div
        style={{ x: parallaxX1, y: parallaxY1 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        onMouseEnter={() => setHoveredIcon("ReactJS")}
        onMouseLeave={() => setHoveredIcon(null)}
        className="absolute top-[18%] left-[12%] z-20 w-11 h-11 rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/50 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400/40 hover:shadow-blue-500/10 hover:scale-110 active:scale-95"
      >
        {techLogos.react}
      </motion.div>

      {/* 2. Next.js Logo (Bottom Right) */}
      <motion.div
        style={{ x: parallaxX2, y: parallaxY2 }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        onMouseEnter={() => setHoveredIcon("NextJS")}
        onMouseLeave={() => setHoveredIcon(null)}
        className="absolute bottom-[20%] right-[10%] z-20 w-11 h-11 rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/50 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-slate-400/40 hover:scale-110 active:scale-95"
      >
        {techLogos.nextjs}
      </motion.div>

      {/* 3. Spring Boot Logo (Top Right) */}
      <motion.div
        style={{ x: parallaxX3, y: parallaxY3 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        onMouseEnter={() => setHoveredIcon("Spring Boot")}
        onMouseLeave={() => setHoveredIcon(null)}
        className="absolute top-[22%] right-[14%] z-20 w-11 h-11 rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/50 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-green-400/40 hover:shadow-green-500/10 hover:scale-110 active:scale-95"
      >
        {techLogos.spring}
      </motion.div>

      {/* 4. Node.js Logo (Bottom Left) */}
      <motion.div
        style={{ x: parallaxX1, y: parallaxY3 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        onMouseEnter={() => setHoveredIcon("NodeJS")}
        onMouseLeave={() => setHoveredIcon(null)}
        className="absolute bottom-[24%] left-[15%] z-20 w-11 h-11 rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/50 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-green-500/40 hover:shadow-green-500/10 hover:scale-110 active:scale-95"
      >
        {techLogos.nodejs}
      </motion.div>

      {/* 5. Docker Logo (Center Bottom) */}
      <motion.div
        style={{ x: parallaxX3, y: parallaxY1 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        onMouseEnter={() => setHoveredIcon("Docker")}
        onMouseLeave={() => setHoveredIcon(null)}
        className="absolute bottom-[10%] left-[45%] z-20 w-11 h-11 rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/50 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400/40 hover:shadow-blue-500/10 hover:scale-110 active:scale-95"
      >
        {techLogos.docker}
      </motion.div>
    </div>
  );
}
