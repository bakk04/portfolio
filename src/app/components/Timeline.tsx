import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Briefcase, Lightbulb } from 'lucide-react';

const timelineItems = [
  {
    year: '2022',
    title: 'timeline.2022',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    year: '2024',
    title: 'timeline.2024',
    icon: GraduationCap,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    year: '2024',
    title: 'timeline.2024.internship',
    icon: Briefcase,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    year: '2026',
    title: 'timeline.2026.agromind',
    icon: Lightbulb,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    year: '2026',
    title: 'timeline.2026.bricole',
    icon: Lightbulb,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    year: '2026',
    title: 'timeline.2026.sehati',
    icon: Lightbulb,
    gradient: 'from-red-500 to-pink-500',
  },
];

interface TimelineItemProps {
  item: typeof timelineItems[0];
  index: number;
  isLast: boolean;
}

function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const Icon = item.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex items-center gap-8"
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? 'text-right' : 'text-left order-2'}`}>
        <motion.div
          className="group relative inline-block"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-white/20">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative z-10">
              <div className={`text-sm font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-2`}>
                {item.year}
              </div>
              <div className="font-medium">
                {t(item.title)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center line and icon */}
      <div className="relative flex flex-col items-center">
        {/* Icon */}
        <motion.div
          className={`relative z-10 w-14 h-14 rounded-full bg-gradient-to-br ${item.gradient} p-3 shadow-xl`}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          whileHover={{ scale: 1.2, rotate: 360 }}
        >
          <Icon className="w-full h-full text-white" />
          
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.gradient} blur-xl opacity-50`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Vertical line */}
        {!isLast && (
          <motion.div
            className={`w-0.5 h-24 bg-gradient-to-b ${item.gradient} opacity-30`}
            initial={{ height: 0 }}
            animate={inView ? { height: 96 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className={`flex-1 ${isEven ? 'order-2' : ''}`} />
    </motion.div>
  );
}

export function Timeline() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="timeline" className="relative py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('timeline.title')}
          </h2>
        </motion.div>

        <div className="space-y-0">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={`${item.year}-${index}`}
              item={item}
              index={index}
              isLast={index === timelineItems.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
