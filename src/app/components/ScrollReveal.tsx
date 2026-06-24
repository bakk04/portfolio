import { motion, type Variants } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const maskVariants: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "mask";
  delay?: number;
};

export function ScrollReveal({
  children,
  className = "",
  variant = "fade",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const variants = variant === "mask" ? maskVariants : revealVariants;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
