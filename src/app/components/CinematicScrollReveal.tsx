import { useRef } from "react";
import { motion, useInView } from "motion/react";

type CinematicRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  intensity?: "gentle" | "cinematic" | "extreme";
};

export function CinematicScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  intensity = "cinematic",
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  // 3D parameters based on intensity
  const scaleStart = intensity === "gentle" ? 0.98 : intensity === "cinematic" ? 0.95 : 0.90;
  const rotateXStart = intensity === "gentle" ? 5 : intensity === "cinematic" ? 15 : 25;
  const blurStart = intensity === "gentle" ? "4px" : intensity === "cinematic" ? "12px" : "24px";

  // Translate offsets
  let xOffset = 0;
  let yOffset = 0;
  if (direction === "up") yOffset = intensity === "extreme" ? 60 : 35;
  if (direction === "down") yOffset = intensity === "extreme" ? -60 : -35;
  if (direction === "left") xOffset = intensity === "extreme" ? 60 : 35;
  if (direction === "right") xOffset = intensity === "extreme" ? -60 : -35;

  const variants = {
    hidden: {
      opacity: 0,
      x: xOffset,
      y: yOffset,
      scale: scaleStart,
      rotateX: rotateXStart,
      filter: `blur(${blurStart})`,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: intensity === "extreme" ? 1.4 : 1.1,
        ease: [0.16, 1, 0.3, 1], // Custom slow-out cubic-bezier
        delay: delay,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="perspective-container"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={className}
        style={{
          willChange: "transform, opacity, filter",
          transformOrigin: "center bottom",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
