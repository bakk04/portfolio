import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

export function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #3b82f6 0%, #8b5cf6 50%, transparent 70%)'
            : 'radial-gradient(circle, #60a5fa 0%, #a78bfa 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)'
            : 'radial-gradient(circle, #a78bfa 0%, #f472b6 50%, transparent 70%)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)'
            : 'radial-gradient(circle, #22d3ee 0%, #60a5fa 50%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: theme === 'dark'
            ? 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
