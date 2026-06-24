import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { Code, Database, Layout, Wrench } from 'lucide-react';

const skills = {
  backend: [
    { name: 'Java', level: 90 },
    { name: 'Spring Boot', level: 85 },
    { name: 'Python', level: 88 },
    { name: 'Django', level: 80 },
    { name: 'Node.js', level: 85 },
    { name: 'ASP.NET', level: 75 },
    { name: 'Ruby', level: 70 },
  ],
  frontend: [
    { name: 'React', level: 92 },
    { name: 'Next.js', level: 88 },
    { name: 'JavaScript', level: 90 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'HTML', level: 95 },
    { name: 'CSS', level: 90 },
  ],
  databases: [
    { name: 'Oracle', level: 80 },
    { name: 'SQL Server', level: 82 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'MySQL', level: 88 },
  ],
  tools: [
    { name: 'Docker', level: 85 },
    { name: 'Git', level: 90 },
    { name: 'Agile', level: 88 },
    { name: 'REST API', level: 92 },
  ],
};

interface SkillCardProps {
  title: string;
  icon: React.ReactNode;
  skills: Array<{ name: string; level: number }>;
  delay: number;
}

function SkillCard({ title, icon, skills: skillList, delay }: SkillCardProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="relative backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden transition-all duration-500 hover:border-white/20">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        
        {/* Animated border */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
              {icon}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>

          <div className="space-y-4">
            {skillList.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: delay + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: delay + index * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
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

export function Skills() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {t('skills.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <SkillCard
            title={t('skills.backend')}
            icon={<Code className="w-6 h-6 text-blue-500" />}
            skills={skills.backend}
            delay={0.1}
          />
          <SkillCard
            title={t('skills.frontend')}
            icon={<Layout className="w-6 h-6 text-purple-500" />}
            skills={skills.frontend}
            delay={0.2}
          />
          <SkillCard
            title={t('skills.databases')}
            icon={<Database className="w-6 h-6 text-pink-500" />}
            skills={skills.databases}
            delay={0.3}
          />
          <SkillCard
            title={t('skills.tools')}
            icon={<Wrench className="w-6 h-6 text-cyan-500" />}
            skills={skills.tools}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
