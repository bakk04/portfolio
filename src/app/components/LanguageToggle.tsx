import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 magnetic overflow-hidden"
      style={{
        background: 'rgba(17, 24, 39, 0.5)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
        }}
        initial={false}
        animate={{
          x: language === 'fr' ? '0%' : '50%',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
      <span 
        className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
          language === 'fr' ? 'text-white' : 'text-white/50'
        }`}
      >
        FR
      </span>
      <span className="relative z-10 text-white/30">|</span>
      <span 
        className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
          language === 'en' ? 'text-white' : 'text-white/50'
        }`}
      >
        EN
      </span>
    </motion.button>
  );
}
