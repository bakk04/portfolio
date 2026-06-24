import { useState } from "react";
import { motion } from "motion/react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface SkillCategory {
  title: { en: string; fr: string };
  skills: SkillItem[];
}

export function Skills() {
  const { lang, theme } = useModelSettings();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const categories: SkillCategory[] = [
    {
      title: { en: "Frontend", fr: "Front-End" },
      skills: [
        {
          name: "React",
          color: "#61DAFB",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M90 50c0-3-1.6-6-4.3-8.8-4.5-4.8-11.8-8-20.5-9.3-5-6-10.4-11-15-14.8-2.6-2.1-5-3.8-7-4.8-1.5-.7-2.6-1-3.2-1-.6 0-1.7.3-3.2 1-2.1 1-4.5 2.7-7 4.8-4.7 3.8-10 8.8-15 14.8-8.7 1.3-16 4.5-20.5 9.3C1.6 44 0 47 0 50s1.6 6 4.3 8.8c4.5 4.8 11.8 8 20.5 9.3 5 6 10.4 11 15 14.8 2.6 2.1 5 3.8 7 4.8 1.5.7 2.6 1 3.2 1 .6 0 1.7-.3 3.2-1 2.1-1 4.5-2.7 7-4.8 4.7-3.8 10-8.8 15-14.8 8.7-1.3 16-4.5 20.5-9.3 2.6-2.8 4.2-5.8 4.2-8.8zm-40 8c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
            </svg>
          ),
        },
        {
          name: "Next.js",
          color: "#ffffff",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm27.8 77.2L50 41.5V75H43V25h6.5l22 28.5V25h7v52.2h-.7z" />
            </svg>
          ),
        },
        {
          name: "TypeScript",
          color: "#3178C6",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 0v100h100V0H0zm84.4 75c-1.8 3.3-4.5 6-7.8 7.8-3.3 1.8-7 2.8-10.8 2.8-5.3 0-9.8-1.7-13.5-5.1-3.7-3.4-5.8-8.2-6.3-14.4h9.3c.5 3.7 1.8 6.5 3.9 8.4 2.1 1.9 4.8 2.8 8.1 2.8 3 0 5.4-.8 7.2-2.3 1.8-1.5 2.7-3.6 2.7-6.2 0-2.2-.7-4.1-2.1-5.6-1.4-1.5-4.2-3.1-8.4-4.8-5.7-2.3-10-4.9-12.8-7.8-2.8-2.9-4.2-6.7-4.2-11.4 0-4.7 1.7-8.7 5.1-12.1 3.4-3.4 8-5.1 13.9-5.1 5.2 0 9.5 1.5 13 4.5s5.5 7.1 5.9 12.3h-9.2c-.4-3-1.4-5.3-3.2-6.8-1.8-1.5-4.1-2.2-6.9-2.2-2.7 0-4.8.7-6.3 2.1-1.5 1.4-2.2 3.2-2.2 5.5 0 2 .7 3.6 2 4.9 1.3 1.3 3.9 2.7 7.8 4.2 6.1 2.4 10.6 5.1 13.5 8.1 2.9 3 4.4 7.1 4.4 12.3-.1 5-1.5 9.1-4.2 12.3zm-39.7-.7c-2.8 3.3-6.5 5-11 5-4.3 0-7.8-1.3-10.5-3.8-2.7-2.5-4.2-6-4.5-10.5h9c.3 2.3 1.1 4.1 2.5 5.4 1.4 1.3 3.2 2 5.5 2 2.5 0 4.5-.7 5.9-2.1 1.4-1.4 2.1-3.4 2.1-6.1V22.2h9.4v39.4c0 5.1-1.3 9.4-3.9 12.7z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Backend", fr: "Back-End" },
      skills: [
        {
          name: "Spring Boot",
          color: "#6DB33F",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M96 46c-2-8-8.2-15.4-16-21C64.6 14 43.6 14.5 30 25c-9.2 7-14.8 17.6-15.3 28-.3 6.8 1.4 13 4.8 18 1.1.8 3.1.2 3.6-1 .4-1.2.6-2.5.7-3.7-.3-10.2 4.2-20.5 12.2-27.5 11.6-10 29.5-10.6 42.4-1.3 5 3.6 8.7 8.5 10.4 13.5 2 5.5 1.5 11-.6 15.6-3 6.8-9.4 11.4-17.2 12.3-5 .6-10.5.2-15-1.5l-3.3 8.3c8 3.5 17.8 4 27.2 1.3 12.7-3.5 22.2-13.4 25-26 1-5 1-10.5-.7-16.5z" />
            </svg>
          ),
        },
        {
          name: "Node.js",
          color: "#339933",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M46.4 10.3c2.2-1.3 4.9-1.3 7.1 0l31 17.9c2.2 1.3 3.6 3.6 3.6 6.1v35.8c0 2.5-1.3 4.8-3.6 6.1l-31 17.9c-2.2 1.3-4.9 1.3-7.1 0l-31-17.9c-2.2-1.3-3.6-3.6-3.6-6.1v-35.8c0-2.5 1.3-4.8 3.6-6.1l31-17.9zM50 20L19.5 37.6V72.4L50 90l30.5-17.6V37.6L50 20z" />
            </svg>
          ),
        },
        {
          name: "Java",
          color: "#ED8B00",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M57.6 15c-3.1 3-5.2 6.8-6.1 11.2 5.1-1.3 10.5-.6 14.8 2 1.2.7 2.4 1.6 3.3 2.6 1.8-4.5 1.8-9.5 0-14-2.8-5-7.7-6-12-1.8zM41 40c-6.8 0-12.7 2.5-16.7 6.6-4 4.1-5.7 9.8-4.5 15.6 1.2 5.8 4.7 10.8 9.5 13.9 1 .6 2.3.6 3.3 0 1.2-.7 1.8-2 1.8-3.4s-.6-2.7-1.8-3.4c-3-2-5.1-5-5.9-8.5-.8-3.5 0-7.2 2.2-10 2.2-2.8 5.7-4.5 9.3-4.5s7.1 1.7 9.3 4.5c2.2 2.8 3 6.5 2.2 10-.8 3.5-2.9 6.5-5.9 8.5-1.2.7-1.8 2-1.8 3.4s.6 2.7 1.8 3.4c1 .6 2.3.6 3.3 0 4.8-3.1 8.3-8.1 9.5-13.9 1.2-5.8-.5-11.5-4.5-15.6C60.7 42.5 54.8 40 48 40h-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Database", fr: "Bases de Données" },
      skills: [
        {
          name: "MySQL",
          color: "#00758F",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M82.3 48.7c-1-5.2-4.5-9.6-9.6-11.9-5-2.3-10.9-2.3-16 0L24.2 52.3c-5.1 2.3-8.6 6.7-9.6 11.9-.9 5.2.9 10.4 4.9 13.9l12 10.4c1.1 1 2.7 1.2 4 .5l30.8-16.4c1.3-.7 2-2.1 2-3.6V56.3c1.2-1.3 3-2.1 4.9-2.1 3.9 0 7 3.1 7 7s-3.1 7-7 7c-1.9 0-3.7-.8-4.9-2.1v12.8c0 1.5.7 2.9 2 3.6l12 6.4c1.3.7 2.9.5 4-.5l12.8-11.1c4.1-3.6 5.9-8.8 4.9-14z" />
            </svg>
          ),
        },
        {
          name: "PostgreSQL",
          color: "#336791",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm24.5 47c-2.3 3.6-5.8 6.3-9.8 7.5-4 1.2-8.3 1-12.1-.6-3.8-1.6-6.9-4.5-8.8-8.1-1.9-3.6-2.6-7.8-2-11.9.6-4.1 2.4-7.8 5.4-10.6 3-2.8 6.9-4.5 11-4.8 4.1-.3 8.2.8 11.6 3.1s5.8 5.7 6.8 9.6c1 3.9.7 8.1-.9 11.8-.8 2.1-2.2 3.9-3.8 4z" />
            </svg>
          ),
        },
        {
          name: "MongoDB",
          color: "#47A248",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5c-3.1 11.2-7 22-12 32-5 10-11 19-18 27C30.5 73.8 41 81.5 50 95c9-13.5 19.5-21.2 30-31 7-8 13-17 18-27-5-10-8.9-20.8-12-32C71.3 11 60.8 7.8 50 5z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "DevOps", fr: "DevOps" },
      skills: [
        {
          name: "Docker",
          color: "#2496ED",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M96.7 42.1c-.8-3.8-3.5-6.5-8-6.5h-5.2c-.3 0-.6.1-.9.3-1.6 1-3.6 1.6-5.8 1.6-5.4 0-9.8-4.4-9.8-9.8 0-1.8.5-3.5 1.4-5-.6-.5-1.3-.8-2.1-.8h-7.6c-.6 0-1.2.5-1.2 1.2v35.8c0 .6.5 1.2 1.2 1.2h44c.6 0 1.2-.5 1.2-1.2V51c.3-3.2 0-6.4-3.2-8.9zM39 46.2v-7.1c0-.6.5-1.2 1.2-1.2h7.1c.6 0 1.2.5 1.2 1.2v7.1c0 .7-.6 1.2-1.2 1.2H40.2c-.6.1-1.2-.4-1.2-1.2z" />
            </svg>
          ),
        },
        {
          name: "Linux",
          color: "#FCC624",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5c-15.6 0-28 12.4-28 28 0 8.2 3.5 15.6 9.1 20.8L22 75.6c-.7 1 .2 2.4 1.4 2.4h53.2c1.2 0 2.1-1.4 1.4-2.4L68.9 53.8c5.6-5.2 9.1-12.6 9.1-20.8 0-15.6-12.4-28-28-28zm0 10c9.9 0 18 8.1 18 18S59.9 51 50 51s-18-8.1-18-18 8.1-18 18-18z" />
            </svg>
          ),
        },
        {
          name: "Git",
          color: "#F05032",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M96 46.5L53.5 4c-4.8-4.8-12.7-4.8-17.5 0L30.5 9.5c.3.5.5 1 .6 1.5L46.5 26.4c1 .6 1.8 1.5 2.2 2.6l11.1 11.1c1.1.4 2 1.2 2.6 2.2l13.9 13.9c1 .6 1.8 1.5 2.2 2.6L96 64c4.8-4.8 4.8-12.7 0-17.5zM26.4 46.5c-.6-1-1.5-1.8-2.6-2.2L12.7 33.2c-4.8 4.8-4.8 12.7 0 17.5l42.5 42.5c4.8 4.8 12.7 4.8 17.5 0l5.5-5.5c-.5-.3-1-.5-1.5-.6L61.3 71.7c-1-.6-1.8-1.5-2.2-2.6l-11-11c-1.1-.4-2-1.2-2.6-2.2L26.4 46.5z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Networks", fr: "Réseaux & Sécurité" },
      skills: [
        {
          name: "Cisco",
          color: "#1BA0D7",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M12 25h6v50h-6V25zm14-10h6v70h-6V15zm14 20h6v30h-6V35zm14-20h6v70h-6V15zm14 10h6v50h-6V25zm14 15h6v20h-6V40zm14-25h6v70h-6V15z" />
            </svg>
          ),
        },
        {
          name: "TCP/IP",
          color: "#60a5fa",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <rect x="15" y="15" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="6" fill="none" />
              <rect x="65" y="15" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="6" fill="none" />
              <rect x="40" y="65" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="6" fill="none" />
              <path d="M25 35v15h40V35M50 50v15" stroke="currentColor" strokeWidth="6" fill="none" />
            </svg>
          ),
        },
        {
          name: "Security",
          color: "#10B981",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10L15 25v30c0 20 15 32 35 37 20-5 35-17 35-37V25L50 10zm-5 45L30 40l5-5 10 10 20-20 5 5-25 25z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <section id="skills" className="py-32 relative overflow-hidden z-10">
      {/* Moving background tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)]" />

      {/* Floating subtle glow elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/[0.02] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/[0.01] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header Label and Title */}
        <div className="mb-16">
          <div className="section-label mb-6">
            {lang === "en" ? "Technologies // Flow Matrix" : "Technologies // Matrice de compétences"}
          </div>
          <h2 className="font-extrabold tracking-tight text-4xl sm:text-5xl font-display leading-tight text-slate-900 dark:text-white">
            {lang === "en" ? "Modern Tech Stack" : "Stack Technologique Moderne"}
          </h2>
          <p className="text-xs text-muted-foreground mt-3 font-body max-w-xl">
            {lang === "en"
              ? "A specialized array of tools and frameworks curated for enterprise-grade backend infrastructure, reactive visual interfaces, and resilient networking configurations."
              : "Un ensemble d'outils et de frameworks sélectionnés pour la conception de services backend, d'interfaces réactives et d'infrastructures réseaux."}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const isHovered = hoveredCategory === idx;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredCategory(idx)}
                onMouseLeave={() => setHoveredCategory(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl p-8 border backdrop-blur-md transition-all duration-500 cursor-default group h-full flex flex-col justify-between ${
                  isHovered
                    ? "bg-white/60 border-blue-500/20 shadow-[0_20px_50px_rgba(96,165,250,0.06)] dark:bg-[#07070a]/60 dark:border-blue-500/20 dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] translateY-[-4px]"
                    : "bg-white/40 border-black/5 dark:bg-[#07070a]/30 dark:border-white/[0.04]"
                }`}
              >
                {/* Radial Glow Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 80% 15%, rgba(96, 165, 250, 0.06), transparent 60%)`,
                  }}
                />

                {/* Animated Edge Border */}
                <div className="absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  {/* Category Title */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono tracking-widest text-blue-500 dark:text-blue-400 uppercase font-bold">
                      // SYSTEM_GROUP_0{idx + 1}
                    </span>
                    <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white">
                      {cat.title[lang]}
                    </h3>
                  </div>

                  {/* Skills Mini-Cards Grid */}
                  <div className="flex flex-col gap-4">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-3.5 p-3 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] bg-black/[0.01] dark:bg-white/[0.01] transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:translate-x-1"
                      >
                        {/* Colorful SVG tech logo wrapper */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 transition-all shadow-sm shrink-0"
                          style={{
                            background: theme === "dark" ? "rgba(13, 13, 17, 0.6)" : "rgba(255, 255, 255, 0.8)",
                            color: skill.color,
                          }}
                        >
                          {skill.icon}
                        </div>

                        {/* Technology Details */}
                        <div className="flex-1 text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">
                            {skill.name}
                          </p>
                          <p className="text-[8px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                            Active Stack // 2026
                          </p>
                        </div>

                        {/* Glowing mini dot indicator */}
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                          style={{
                            backgroundColor: skill.color,
                            boxShadow: `0 0 8px ${skill.color}`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating particle micro-animation on category cards */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="absolute bottom-[10%] right-[10%] w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
