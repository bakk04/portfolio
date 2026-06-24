import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <div className="relative backdrop-blur-xl rounded-full border border-white/10 px-6 py-3 flex items-center justify-between"
          style={{ background: 'rgba(17, 24, 39, 0.5)' }}
        >
          {/* Logo */}
          <motion.div
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            whileHover={{ scale: 1.05 }}
          >
            YBT
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
