import { motion } from 'motion/react';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MagneticButton } from './MagneticButton';
import { useTheme } from '../contexts/ThemeContext';

export function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mouse-reactive glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #3b82f6 0%, #8b5cf6 50%, transparent 70%)'
            : 'radial-gradient(circle, #60a5fa 0%, #a78bfa 50%, transparent 70%)',
        }}
        animate={{
          x: ['-50%', '-45%', '-50%'],
          y: ['-50%', '-55%', '-50%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="text-center">
          {/* Animated text reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: theme === 'dark'
                  ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {t('hero.title')}
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2 mb-4"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {t('hero.subtitle1')}
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">
              {t('hero.subtitle2')}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            {t('hero.description')}
          </motion.p>

          {/* Magnetic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <MagneticButton
              onClick={scrollToProjects}
              className="group relative px-8 py-4 rounded-full overflow-hidden backdrop-blur-xl border border-white/10"
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-opacity duration-300"
                style={{ opacity: 1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                {t('hero.viewProjects')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-white/20 blur-xl" />
              </div>
            </MagneticButton>

            <MagneticButton
              className="group relative px-8 py-4 rounded-full overflow-hidden backdrop-blur-xl border border-white/20 hover:border-white/30 transition-colors"
            >
              <span className="relative z-10 flex items-center gap-2 font-medium">
                <Download className="w-5 h-5" />
                {t('hero.downloadCV')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MagneticButton>

            <MagneticButton
              onClick={scrollToContact}
              className="group relative px-8 py-4 rounded-full overflow-hidden backdrop-blur-xl border border-white/20 hover:border-white/30 transition-colors"
            >
              <span className="relative z-10 flex items-center gap-2 font-medium">
                <Mail className="w-5 h-5" />
                {t('hero.contact')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MagneticButton>
          </motion.div>

          {/* Floating scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
