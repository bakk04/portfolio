import { useRef } from "react";

type PerspectiveCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees
  glareOpacity?: number; // Max glare opacity (0 to 1)
};

export function PerspectiveCard({
  children,
  className = "",
  maxTilt = 8,
  glareOpacity = 0.15,
}: PerspectiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x position relative to card
    const y = e.clientY - rect.top; // Mouse y position relative to card

    const width = rect.width;
    const height = rect.height;

    // Convert mouse position to percentages (-0.5 to 0.5)
    const px = x / width - 0.5;
    const py = y / height - 0.5;

    // Calculate rotation angles
    const rotateY = px * maxTilt;
    const rotateX = -py * maxTilt;

    // Apply rotation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Apply shifting glare highlight
    if (glare) {
      const gx = (x / width) * 100;
      const gy = (y / height) * 100;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 60%)`;
      glare.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    // Smooth return to base state
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";

    if (glare) {
      glare.style.opacity = "0";
      glare.style.transition = "opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    }
  };

  const handleMouseEnter = () => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    // Remove transitions during active mouse track for raw latency-free response
    card.style.transition = "none";
    if (glare) {
      glare.style.transition = "none";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-card rounded-2xl relative overflow-hidden transition-shadow duration-300 border border-border select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Glare Overlay */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-30 opacity-0 transition-opacity"
        style={{
          mixBlendMode: "overlay",
          willChange: "background, opacity",
        }}
      />
      
      {/* Inner Content wrapper to allow 3D depth shadows */}
      <div style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
