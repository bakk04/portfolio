import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { Award } from 'lucide-react';

const certifications = [
  {
    id: 'python',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'react',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'agile',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'cpp',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

interface CertificationCardProps {
  certification: typeof certifications[0];
  index: number;
}

function CertificationCard({ certification, index }: CertificationCardProps) {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <div className="relative backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden transition-all duration-500 hover:border-white/20 hover:scale-105">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${certification.gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500`} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute -inset-1 bg-gradient-to-r ${certification.gradient} blur-2xl opacity-30`} />
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={false}
        >
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${certification.gradient}`} />
          <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${certification.gradient}`} />
        </motion.div>

        <div className="relative z-10 text-center">
          {/* Icon */}
          <motion.div
            className={`inline-flex w-20 h-20 rounded-full bg-gradient-to-br ${certification.gradient} p-4 mb-4 shadow-xl`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Award className="w-full h-full text-white" />
          </motion.div>

          {/* Title */}
          <h3 className={`text-xl font-bold bg-gradient-to-r ${certification.gradient} bg-clip-text text-transparent`}>
            {t(`certifications.${certification.id}`)}
          </h3>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${certification.gradient} rounded-full`}
              style={{
                left: `${25 + i * 15}%`,
                top: `${40 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Certifications() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certifications" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('certifications.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {certifications.map((certification, index) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Decorative element */}
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </section>
  );
}
