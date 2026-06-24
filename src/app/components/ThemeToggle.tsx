import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useModelSettings } from '../contexts/ModelSettingsContext';

export function ThemeToggle() {
  const { theme, setTheme } = useModelSettings();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center cursor-pointer overflow-hidden"
      style={{
        background: theme === 'dark' 
          ? 'rgba(10, 10, 12, 0.6)'
          : 'rgba(240, 244, 248, 0.6)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute w-5.5 h-5.5 rounded-full flex items-center justify-center"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
            : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          boxShadow: theme === 'dark'
            ? '0 0 12px rgba(59, 130, 246, 0.4)'
            : '0 0 12px rgba(245, 158, 11, 0.3)',
        }}
        animate={{
          x: theme === 'dark' ? 3 : 29,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-2.5 h-2.5 text-white" />
        ) : (
          <Sun className="w-2.5 h-2.5 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}
