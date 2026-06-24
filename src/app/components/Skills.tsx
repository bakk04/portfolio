import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useModelSettings } from "../contexts/ModelSettingsContext";

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  color: string;
  details: string;
}

interface SkillCategory {
  title: { en: string; fr: string };
  skills: SkillItem[];
}

function TiltCard({ children, className, glowColor }: { children: React.ReactNode; className: string; glowColor: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = -(y - yc) / 12; // tilt angle X
    const angleY = (x - xc) / 12; // tilt angle Y
    setTransform(`perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlowStyle({
      opacity: 0.15,
      x: x,
      y: y,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlowStyle({ opacity: 0, x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        boxShadow: glowStyle.opacity > 0 ? `0 20px 45px rgba(0, 0, 0, 0.25), 0 0 30px ${glowColor}15` : "none",
      }}
      className={`${className} relative overflow-hidden`}
    >
      {/* Radial Hover Glow */}
      <div
        className="absolute pointer-events-none rounded-full blur-3xl transition-opacity duration-300"
        style={{
          width: "250px",
          height: "250px",
          top: glowStyle.y - 125,
          left: glowStyle.x - 125,
          opacity: glowStyle.opacity,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {children}
    </div>
  );
}

export function Skills() {
  const { lang, theme } = useModelSettings();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories: SkillCategory[] = [
    {
      title: { en: "Frontend & Interfaces", fr: "Front-End & Interfaces" },
      skills: [
        {
          name: "React.js",
          color: "#61DAFB",
          details: "React 18, Hooks, Dynamic Routing",
          icon: (
            <svg className="w-5.5 h-5.5 group-hover:rotate-[360deg] transition-transform duration-[4s] ease-linear" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="50" rx="8" ry="20" stroke="#61DAFB" strokeWidth="4.5" transform="rotate(0 50 50)" />
              <ellipse cx="50" cy="50" rx="8" ry="20" stroke="#61DAFB" strokeWidth="4.5" transform="rotate(60 50 50)" />
              <ellipse cx="50" cy="50" rx="8" ry="20" stroke="#61DAFB" strokeWidth="4.5" transform="rotate(120 50 50)" />
              <circle cx="50" cy="50" r="4.5" fill="#61DAFB" />
            </svg>
          ),
        },
        {
          name: "Next.js",
          color: "#000000",
          details: "App Router, SSR, Server Actions",
          icon: (
            <svg className="w-5.5 h-5.5 rounded-full dark:bg-white p-0.5 bg-black" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" />
              <path d="M72 72L36 28V72H28V24H35.5L72 70.5V24H80V72H72Z" fill="currentColor" />
            </svg>
          ),
        },
        {
          name: "TypeScript",
          color: "#3178C6",
          details: "Strict Typing, Interfaces, Generic Types",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="12" fill="#3178C6" />
              <path d="M32 30H48V38H41V70H32V38H25V30H32ZM71 49C71 44.5 69.5 40.5 66.5 37.5C63.5 34.5 59.5 33 54.5 33C50.5 33 47.5 34 45 36V45H53V42C54.2 41 55.5 40.5 57 40.5C58.8 40.5 60 41.5 61 43.5C61.8 45.5 62 48.5 62 52.5C62 56.5 61.8 59.5 61 61.5C60 63.5 58.8 64.5 57 64.5C55.5 64.5 54.2 64 53 63V60H45V69C47.5 71 50.5 72 54.5 72C59.5 72 63.5 70.5 66.5 67.5C69.5 64.5 71 60.5 71 56V49Z" fill="white" />
            </svg>
          ),
        },
        {
          name: "Tailwind CSS",
          color: "#38BDF8",
          details: "Utility-First, Responsive layouts",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M26 40C33 30 46 25 58 31C63 33.5 66 38.5 68 44C71.5 39 76.5 36.5 82 38.5C88 40.5 91 46.5 90 53C88 65 75 70 63 64C58 61.5 55 56.5 53 51C49.5 56 44.5 58.5 39 56.5C33 54.5 30 48.5 31 42C31.5 38.5 28.5 36.5 26 40ZM50 56.5C55.5 58.5 60.5 56 64 51C60.5 46 55.5 43.5 50 45.5C44.5 47.5 41.5 53.5 42 57C44.5 55.5 47.5 55 50 56.5Z" fill="#38BDF8" />
            </svg>
          ),
        },
        {
          name: "Framer Motion",
          color: "#F2059F",
          details: "Shared Layout, Page transitions",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M20 20H80L50 50L20 20Z" fill="#F2059F" />
              <path d="M20 50H50L80 80H20V50Z" fill="#F2059F" />
              <path d="M50 50L80 20V50H50Z" fill="#8C035C" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Backend & Systems", fr: "Back-End & Systèmes" },
      skills: [
        {
          name: "Spring Boot",
          color: "#6DB33F",
          details: "Java, Dependency Injection, Security",
          icon: (
            <svg className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="12" fill="#6DB33F" />
              <path d="M50 15C32.3 26 21 44.7 20 65C32.3 54 43.7 35.3 45 15C56.3 26 65 44.7 66 65C53.7 54 42.3 35.3 41 15C50 15 50 85 50 85" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
        {
          name: "Node.js",
          color: "#339933",
          details: "Express, Event-Driven, Async APIs",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M50 10L84.6 30V70L50 90L15.4 70V30L50 10Z" fill="#339933" />
              <path d="M50 20L76 35V65L50 80L24 65V35L50 20Z" fill="white" />
              <path d="M50 35V65" stroke="#339933" strokeWidth="8" strokeLinecap="round" />
            </svg>
          ),
        },
        {
          name: "Java Core",
          color: "#ED8B00",
          details: "OOP, Multithreading, Streams API",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M30 75C42 78 58 78 70 75M25 82C40 86 60 86 75 82" stroke="#E66A1F" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M60 15C60 15 65 25 55 35C45 45 42 55 45 62" stroke="#5382A1" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M48 10C48 10 52 20 45 28C38 36 36 46 38 53" stroke="#5382A1" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          ),
        },
        {
          name: "Python / Django",
          color: "#3776AB",
          details: "DRF, ORM, AI Model Pipelines",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M48 4C23.5 4 24 21 24 21H38V25H21C21 25 4 24.5 4 48C4 71.5 19.5 70.5 19.5 70.5V57H38V38H62V24.5C62 24.5 62.5 4 48 4Z" fill="#3776AB" />
              <path d="M52 96C76.5 96 76 79 76 79H62V75H79C79 79 96 75.5 96 52C96 28.5 80.5 29.5 80.5 29.5V43H62V62H38V75.5C38 75.5 37.5 96 52 96Z" fill="#FFD343" />
              <circle cx="34" cy="14" r="3.5" fill="white" />
              <circle cx="66" cy="86" r="3.5" fill="black" />
            </svg>
          ),
        },
        {
          name: "C++ Programming",
          color: "#00599C",
          details: "Pointers, TinyML, Arduino C/C++",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M50 5L90 28.5V71.5L50 95L10 71.5V28.5L50 5Z" fill="#00599C" />
              <path d="M45 42H60V48H45V63H39V48H24V42H39V27H45V42ZM75 42H90V48H75V63H69V48H54V42H69V27H75V42Z" fill="white" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Databases & Storage", fr: "Bases de Données" },
      skills: [
        {
          name: "PostgreSQL",
          color: "#336791",
          details: "Complex Queries, Triggers, Optimization",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M90 40C90 20 70 10 50 10C30 10 10 20 10 40C10 60 22 75 35 78V90H45V79H55V90H65V78C78 75 90 60 90 40Z" fill="#336791" />
              <path d="M28 35C28 28 36 22 45 22C54 22 62 28 62 35C62 42 54 48 45 48C36 48 28 42 28 35Z" fill="white" />
            </svg>
          ),
        },
        {
          name: "MySQL",
          color: "#00758F",
          details: "Relational Design, SQL Server, Indexing",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M12 45C12 25 32 15 50 15C68 15 88 25 88 45C88 65 72 75 50 78C28 75 12 65 12 45Z" fill="#00758F" />
              <path d="M50 25C60 25 68 30 68 40C68 50 50 55 50 65M38 52L50 65L62 52" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
        {
          name: "MongoDB",
          color: "#47A248",
          details: "NoSQL, Collections, Document design",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M50 5C45 22 28 42 28 60C28 78 40 92 50 95C60 92 72 78 72 60C72 42 55 22 50 5Z" fill="#47A248" />
              <path d="M50 15V85" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "DevOps & Infrastructure", fr: "DevOps & Outils" },
      skills: [
        {
          name: "Docker",
          color: "#2496ED",
          details: "Containerization, Multi-stage builds",
          icon: (
            <svg className="w-5.5 h-5.5 group-hover:animate-bounce" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="10" width="16" height="16" fill="#2496ED" rx="3" />
              <rect x="36" y="10" width="16" height="16" fill="#2496ED" rx="3" />
              <rect x="57" y="10" width="16" height="16" fill="#2496ED" rx="3" />
              <rect x="25" y="30" width="16" height="16" fill="#2496ED" rx="3" />
              <rect x="46" y="30" width="16" height="16" fill="#2496ED" rx="3" />
              <rect x="67" y="30" width="16" height="16" fill="#2496ED" rx="3" />
              <path d="M10 52C22 52 28 62 48 62C68 62 72 45 92 45C95 62 82 85 50 85C18 85 5 70 10 52Z" fill="#2496ED" />
            </svg>
          ),
        },
        {
          name: "Linux (OS)",
          color: "#FCC624",
          details: "Bash Scripting, Cron, Server Management",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="45" rx="22" ry="25" fill="#FCC624" />
              <circle cx="42" cy="40" r="3.5" fill="black" />
              <circle cx="58" cy="40" r="3.5" fill="black" />
              <path d="M38 72C38 72 32 85 50 85C68 85 62 72 62 72H38Z" fill="#3E3E3E" />
              <ellipse cx="50" cy="54" rx="6" ry="3" fill="#E67E22" />
            </svg>
          ),
        },
        {
          name: "Git & Versioning",
          color: "#F05032",
          details: "Git Flow, Hooks, Actions CI/CD",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="12" fill="#F05032" />
              <circle cx="70" cy="50" r="8" fill="white" />
              <circle cx="38" cy="30" r="8" fill="white" />
              <circle cx="38" cy="70" r="8" fill="white" />
              <path d="M38 38V62" stroke="white" strokeWidth="5.5" />
              <path d="M38 52C48 52 58 50 70 50" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
            </svg>
          ),
        },
      ],
    },
    {
      title: { en: "Networks & Edge Computing", fr: "Réseaux & IoT" },
      skills: [
        {
          name: "Cisco Infrastructure",
          color: "#1BA0D7",
          details: "Routing, Switching, VLANs, Packets",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <path d="M12 30V70M24 15V85M36 38V62M48 20V80M60 38V62M72 15V85M84 30V70" stroke="#1BA0D7" strokeWidth="8.5" strokeLinecap="round" />
            </svg>
          ),
        },
        {
          name: "TCP/IP & Protocol Stack",
          color: "#60A5FA",
          details: "DNS, HTTP/S, SSL/TLS, Architecture",
          icon: (
            <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none">
              <rect x="18" y="18" width="22" height="22" rx="4" stroke="#60A5FA" strokeWidth="5.5" fill="none" />
              <rect x="60" y="18" width="22" height="22" rx="4" stroke="#60A5FA" strokeWidth="5.5" fill="none" />
              <rect x="39" y="60" width="22" height="22" rx="4" stroke="#60A5FA" strokeWidth="5.5" fill="none" />
              <path d="M29 40v10h42V40M50 50v10" stroke="#60A5FA" strokeWidth="5.5" fill="none" />
            </svg>
          ),
        },
        {
          name: "IoT & TinyML",
          color: "#10B981",
          details: "ESP32, MQTT protocols, Edge AI models",
          icon: (
            <svg className="w-5.5 h-5.5 animate-pulse" viewBox="0 0 100 100" fill="none">
              <rect x="22" y="22" width="56" height="56" rx="6" fill="#10B981" />
              <path d="M22 36H12M22 50H12M22 64H12M78 36H88M78 50H88M78 64H88M36 22H12M50 22H12M64 22H12M36 78H88M50 78H88M64 78H88" stroke="#10B981" strokeWidth="5" />
              <circle cx="50" cy="50" r="12" fill="white" />
              <path d="M45 50L48 53L55 46" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <section id="skills" className="py-32 relative overflow-hidden z-10">
      {/* Moving cyber-grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]" />

      {/* Floating neon glow overlays */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/[0.015] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/[0.012] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="mb-20 text-left">
          <div className="section-label mb-6">
            {lang === "en" ? "System Architectures // Stack Nodes" : "Architectures Système // Matrice de stack"}
          </div>
          <h2 className="font-extrabold tracking-tight text-2xl sm:text-3.5xl md:text-4xl font-display leading-tight text-slate-900 dark:text-white">
            {lang === "en" ? "Interactive Stack Matrix" : "Matrice Technologique Interactive"}
          </h2>
          <p className="text-xs.5 md:text-sm text-muted-foreground mt-4 font-body max-w-2xl leading-relaxed">
            {lang === "en"
              ? "A specialized array of tools and frameworks curated for enterprise-grade backend service designs, high-fidelity user interfaces, and embedded tinyML computation systems."
              : "Un ensemble d'outils et de frameworks sélectionnés pour la conception de services backend, d'interfaces utilisateur et d'infrastructures IoT intelligents."}
          </p>
        </div>

        {/* Categories Grid (Overhauled dynamic slide-up reveal stagger animation) */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 35, filter: "blur(3px)" },
                show: { 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)",
                  transition: { type: "spring", stiffness: 280, damping: 24 } 
                }
              }}
            >
              <TiltCard
                className={`rounded-[30px] p-8 border backdrop-blur-md transition-all duration-300 h-full flex flex-col justify-between ${
                  theme === "dark"
                    ? "bg-[#030303]/60 border-white/[0.05]"
                    : "bg-white/60 border-slate-200/80 shadow-md shadow-slate-100"
                }`}
                glowColor={idx === 0 ? "#61DAFB" : idx === 1 ? "#6DB33F" : idx === 2 ? "#336791" : idx === 3 ? "#2496ED" : "#1BA0D7"}
              >
                <div>
                  <div className="flex items-center justify-between mb-8 border-b border-black/[0.03] dark:border-white/[0.04] pb-4">
                    <span className="text-[10px] font-mono tracking-widest text-blue-500 dark:text-blue-400 uppercase font-bold">
                      // MATRIX_NODE_0{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                      {cat.title[lang]}
                    </h3>
                  </div>

                  {/* Skills Mini-Rows */}
                  <div className="flex flex-col gap-4">
                    {cat.skills.map((skill, sIdx) => {
                      const isHovered = hoveredSkill === skill.name;
                      return (
                        <div
                          key={sIdx}
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                            isHovered
                              ? "border-blue-500/20 bg-blue-500/[0.03] translate-x-1 shadow-sm"
                              : "border-black/[0.02] dark:border-white/[0.02] bg-black/[0.01] dark:bg-white/[0.01]"
                          }`}
                          style={{
                            boxShadow: isHovered ? `0 4px 15px ${skill.color}10` : "none",
                          }}
                        >
                          {/* Colored SVG Logo wrapper */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 shadow-inner shrink-0 group"
                            style={{
                              background: theme === "dark" ? "rgba(10, 10, 12, 0.85)" : "rgba(255, 255, 255, 0.9)",
                              borderColor: isHovered ? `${skill.color}35` : "transparent",
                            }}
                          >
                            {skill.icon}
                          </div>

                          {/* Text details */}
                          <div className="flex-1 text-left">
                            <p className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 font-display">
                              {skill.name}
                            </p>
                            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-body">
                              {skill.details}
                            </p>
                          </div>

                          {/* Dot indicator */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${isHovered ? "scale-125 animate-ping" : ""}`}
                            style={{
                              backgroundColor: skill.color,
                              boxShadow: `0 0 10px ${skill.color}`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
