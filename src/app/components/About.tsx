import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedCounter } from './AnimatedCounter';

export function About() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('about.title')}
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <AnimatedCounter end={15} suffix="+" label={t('about.projects')} />
          <AnimatedCounter end={20} suffix="+" label={t('about.technologies')} />
          <AnimatedCounter end={4} suffix="+" label={t('about.years')} />
          <AnimatedCounter end={4} suffix="+" label={t('about.certificates')} />
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </section>
  );
}
