import { useEffect, useRef, useState } from "react";

export function TelemetryWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpm, setBpm] = useState(72);
  const [isVisible, setIsVisible] = useState(true);

  // Viewport Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 });

    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  // Pulsing BPM simulation
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm(68 + Math.floor(Math.random() * 8));
    }, 3000);
    return () => clearInterval(bpmInterval);
  }, []);

  // Oscilloscope drawing loop
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let h = (canvas.height = 110);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.parentElement?.clientWidth || 300;
      h = canvas.height = 110;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let phase = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;
      
      const gridSpacing = 20;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw heart wave pulse
      ctx.beginPath();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.85)"; // Sky blue
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(56, 189, 248, 0.5)";

      for (let x = 0; x < w; x++) {
        // Base sine wave with heartbeat pulse overlay
        const baseSine = Math.sin(x * 0.04 + phase);
        
        // Simulate heartbeat pulse (EKG peak spikes) at intervals
        let ekgPeak = 0;
        const pulseCycle = (x + phase * 40) % (w * 0.7);
        if (pulseCycle < 25) {
          ekgPeak = Math.sin(pulseCycle * 0.25) * 22;
          if (pulseCycle > 12 && pulseCycle < 18) {
            ekgPeak = -ekgPeak * 1.8; // EKG downward spike
          }
        }

        const y = h / 2 + baseSine * 3 + ekgPeak;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Reset shadows
      ctx.shadowBlur = 0;

      // Increment phase for movement speed
      phase -= 0.035;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#08080b]/90 border border-white/5 rounded-xl p-4 overflow-hidden select-none"
    >
      <div className="flex items-center justify-between mb-2 text-[8px] font-mono text-slate-400 tracking-wider">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          <span>SEHATI_rPPG_INFERENCE</span>
        </span>
        <span className="text-cyan-400 font-bold uppercase">60 FPS stable</span>
      </div>
      
      <div className="relative w-full h-[110px] bg-black/40 rounded-lg overflow-hidden border border-white/[0.02]">
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Dynamic BPM Indicator overlay */}
        <div className="absolute top-2.5 right-3 flex flex-col items-end">
          <span className="text-[14px] font-mono font-black text-cyan-400 tracking-tight leading-none animate-pulse">
            {bpm}
          </span>
          <span className="text-[6px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-0.5">
            SYS_BPM_LOCK
          </span>
        </div>
      </div>
    </div>
  );
}
