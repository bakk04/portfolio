import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, Smartphone, Globe, Heart, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const projects = [
  {
    id: 'agromind',
    icon: Smartphone,
    tech: ['React Native', 'Python', 'C++', 'MQTT', 'HiveMQ'],
    gradient: 'from-green-500 to-emerald-500',
    link: null,
  },
  {
    id: 'bricole',
    icon: Globe,
    tech: ['Next.js', 'JavaScript', 'Tailwind CSS'],
    gradient: 'from-blue-500 to-cyan-500',
    link: 'https://bricole-ma.vercel.app/',
  },
  {
    id: 'sehati',
    icon: Heart,
    tech: ['React', 'AI', 'Computer Vision', '60 FPS'],
    gradient: 'from-red-500 to-pink-500',
    link: 'https://sehati-iota.vercel.app/',
  },
  {
    id: 'beinterim',
    icon: Users,
    tech: ['Full Stack', 'AI CV Parsing', 'REST API'],
    gradient: 'from-purple-500 to-indigo-500',
    link: 'https://beinterim-demo-production.up.railway.app',
  },
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const Icon = project.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:scale-[1.02]">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} blur-2xl opacity-30`} />
        </div>

        <div className="relative z-10 p-8">
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.gradient} p-4 mb-6 shadow-xl`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Icon className="w-full h-full text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-3xl font-bold mb-3">
            {t(`projects.${project.id}.title`)}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {t(`projects.${project.id}.description`)}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl border border-white/10 bg-white/5"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Link */}
          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${project.gradient} text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-${project.gradient.split('-')[1]}-500/20`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('projects.viewLive')}
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${project.gradient} rounded-full`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${project.gradient} blur-3xl opacity-20`} />
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('projects.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </section>
  );
}
