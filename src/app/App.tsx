import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { SmoothScroll, scrollToSection } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { useLenis } from "./contexts/LenisContext";
import type { Lang, ChatMessage } from "./types";
import { ModelSettingsProvider, useModelSettings } from "./contexts/ModelSettingsContext";

// Lucide Icons for Premium luxury Look
import { Sparkles, Terminal, Cpu, Play, Settings, X, Globe, MessageSquare, AlertCircle, CheckCircle, ShieldAlert, Award, Calendar, ExternalLink } from "lucide-react";

// Modern UI & Visual Redesign Components
import { PreloaderModern } from "./components/PreloaderModern";
import { FuturisticBackground } from "./components/FuturisticBackground";
import { GeminiWaveMesh } from "./components/GeminiWaveMesh";
import { CinematicScrollReveal } from "./components/CinematicScrollReveal";
import { PerspectiveCard } from "./components/PerspectiveCard";
import { NeuralNetwork } from "./components/NeuralNetwork";
import { AskYounesAi } from "./components/AskYounesAi";
import { TokenizerPlayground } from "./components/TokenizerPlayground";
import { TelemetryWave } from "./components/TelemetryWave";
import { InteractiveScene3D } from "./components/InteractiveScene3D";
import { Skills } from "./components/Skills";
import { BackToTopButton } from "./components/BackToTopButton";

// ─── Translations ─────────────────────────────────────────────
const T = {
  en: {
    nav: [
      { label: "Home", id: "hero" },
      { label: "About", id: "about" },
      { label: "Skills Flow", id: "skills" },
      { label: "Projects", id: "projects" },
      { label: "Journey", id: "timeline" },
      { label: "Contact", id: "contact" },
    ],
    available: "Active Status: Ready for Opportunities",
    heroGreeting: "Hi, I'm",
    heroName: ["Younes", "Bakkali Terghi"],
    heroTitle: "Engineering the Future of Systems.",
    heroSub: "4th-Year Engineering Student at EMSI Rabat",
    heroDesc: "Information Systems and Development Student. Top of the Class (Majorant). Full-Stack Developer & AI Innovator.",
    heroCta1: "Launch Work",
    heroCta2: "Establish Contact",
    heroScroll: "Scroll to explore",
    aboutLabel: "About // Majorant Status",
    aboutTitle: "Crafting tomorrow,\none line at a time.",
    aboutBio1: "I am a 4th-year Computer Engineering student at EMSI (École Marocaine des Sciences de l'Ingénieur) in Rabat, specializing in Information Systems and Software Development. Graduating as the top of my class (Majorant), my work centers on engineering robust architectures and integrating artificial intelligence.",
    aboutBio2: "I design reliable backend services, responsive interfaces, and Edge Computing IoT applications. I believe software must be both technically sound and visually engaging, aligning with high UI/UX standards.",
    stats: [
      { value: 10, suffix: "+", label: "Projects Completed" },
      { value: 4,  suffix: "",  label: "Key Certifications" },
      { value: 1,  suffix: "",  label: "Industry Stage" },
      { value: 1,  suffix: "st", label: "Class Rank (Majorant)" },
    ],
    skillsLabel: "Skills Flow // Neural Network Mesh",
    skillsTitle: "Technologies\nI build with",
    projectsLabel: "Selected Work // Repository",
    projectsTitle: "Projects that\npush boundaries",
    viewProject: "Launch App",
    viewCode: "Source",
    timelineLabel: "Journey // Chronology",
    timelineTitle: "Experience &\nEducation",
    certsLabel: "Certifications // Learning",
    certsTitle: "Continuous\nlearning",
    contactLabel: "Contact // Establish Connection",
    contactTitle: "Let's build\nsomething great",
    contactDesc: "Have a project in mind? I'd love to collaborate.",
    contactName: "Name",
    contactEmail: "Email",
    contactMsg: "Message",
    contactSend: "Send Message",
    contactSent: "Message sent — I'll be in touch!",
    footerBuilt: "Designed & built by",
    footerRights: "All rights reserved.",
  },
  fr: {
    nav: [
      { label: "Accueil", id: "hero" },
      { label: "À propos", id: "about" },
      { label: "Compétences", id: "skills" },
      { label: "Projets", id: "projects" },
      { label: "Parcours", id: "timeline" },
      { label: "Contact", id: "contact" },
    ],
    available: "Statut Actif : Prêt pour Nouvelles Opportunités",
    heroGreeting: "Bonjour, je suis",
    heroName: ["Younes", "Bakkali Terghi"],
    heroTitle: "Ingénierie du Futur des Systèmes.",
    heroSub: "Élève Ingénieur de 4ème Année à l'EMSI Rabat",
    heroDesc: "Étudiant en Systèmes d'Information et Développement. Major de Promotion. Développeur Full-Stack & Innovateur IA.",
    heroCta1: "Lancer les Projets",
    heroCta2: "Me Contacter",
    heroScroll: "Défiler pour explorer",
    aboutLabel: "À Propos // Statut Major",
    aboutTitle: "Construire demain,\nune ligne à la fois.",
    aboutBio1: "Je suis élève ingénieur de 4ème année à l'EMSI (École Marocaine des Sciences de l'Ingénieur) à Rabat, spécialisé en Systèmes d'Information et Développement. Major de ma promotion, mes activités s'articulent autour de la conception d'architectures robustes et de l'intégration de modèles d'IA.",
    aboutBio2: "Je conçois des services backend performants, des interfaces web pixel-perfect et des applications IoT de pointe. Je suis convaincu que les applications d'exception combinent une ingénierie rigoureuse avec une ergonomie soignée.",
    stats: [
      { value: 10, suffix: "+", label: "Projets Réalisés" },
      { value: 4,  suffix: "",  label: "Certifications Clés" },
      { value: 1,  suffix: "",  label: "Stage Industriel" },
      { value: 1,  suffix: "er", label: "Rang (Major de Promo)" },
    ],
    skillsLabel: "Compétences // Réseau Neuronal",
    skillsTitle: "Technologies\navec lesquelles je construis",
    projectsLabel: "Projets Sélectionnés // Dépôts",
    projectsTitle: "Projets qui\nrepoussent les limites",
    viewProject: "Lancer",
    viewCode: "Source",
    timelineLabel: "Parcours // Chronologie",
    timelineTitle: "Expérience &\nFormation",
    certsLabel: "Certifications // Apprentissage",
    certsTitle: "Apprentissage\ncontinu",
    contactLabel: "Contact // Établir Connexion",
    contactTitle: "Construisons\nquelque chose de grand",
    contactDesc: "Un projet en tête ? J'adorerais collaborer.",
    contactName: "Nom Complet",
    contactEmail: "Adresse Email",
    contactMsg: "Votre Message",
    contactSend: "Envoyer",
    contactSent: "Message envoyé — je reviendrai vers vous !",
    footerBuilt: "Conçu & développé par",
    footerRights: "Tous droits réservés.",
  },
} as const;

// ─── Data ─────────────────────────────────────────────────────
const SKILLS = [
  { name: "Back End & Langages", icon: "⬡", color: "#3b82f6", items: ["Java", "Python", "C++", "ASP.NET", "Ruby", "Spring Boot", "Django", "Node.js", "API REST"] },
  { name: "Front End & Web Design", icon: "◈", color: "#06b6d4", items: ["HTML", "Javascript", "Next.js", "React.js", "Tailwind CSS", "Framer Motion"] },
  { name: "Bases de données", icon: "⬢", color: "#10b981", items: ["Oracle", "SQL Server", "PostgreSQL", "MySQL"] },
  { name: "Soft Skills & Outils", icon: "◉", color: "#64748b", items: ["Résolution de problèmes", "Sens de l'organisation", "Communication", "Agile/Scrum", "Git", "Docker"] },
];

const PROJECTS = [
  {
    num: "01",
    id: "sehati",
    name: "Sehati MedTech",
    tag: "rPPG Computer Vision",
    color: "#38bdf8", // Sky blue
    year: "2026",
    metrics: ["60 FPS Edge", "State-Space Model", "94% Accuracy"],
    desc: {
      en: "Health-tech PWA executing computer vision rPPG models locally at 60 FPS for remote heart rate tracking, preserving total data privacy.",
      fr: "PWA MedTech exécutant des modèles de vision par ordinateur rPPG en local à 60 FPS pour le suivi cardiaque, garantissant la confidentialité des données.",
    },
    tech: ["Next.js", "Capacitor", "Modèles SSM", "Tailwind CSS"],
    demoUrl: "https://sehati-iota.vercel.app/",
    codeUrl: "https://github.com/bakk04",
  },
  {
    num: "02",
    id: "bricole",
    name: "Bricole.ma",
    tag: "Marketplace PWA",
    color: "#60a5fa", // Blue
    year: "2026",
    metrics: ["500+ Artisans", "Real-Time Matching", "Vercel Hosted"],
    desc: {
      en: "Morocco's leading PWA marketplace connecting local artisans with clients, featuring real-time location mapping and booking workflows.",
      fr: "La première marketplace PWA de services au Maroc mettant en relation artisans et clients avec géolocalisation et prise de rendez-vous en temps réel.",
    },
    tech: ["Next.js", "Javascript", "Tailwind CSS", "PWA"],
    demoUrl: "https://bricole-ma.vercel.app/",
    codeUrl: "https://github.com/bakk04/Bricole.ma",
  },
  {
    num: "03",
    id: "beinterim",
    name: "Beinterim HR-Platform",
    tag: "AI Parsing Automation",
    color: "#10b981", // Emerald
    year: "2024",
    metrics: ["Tri Candidats: -40%", "Accuracy Parser: 85%", "MongoDB / Node"],
    desc: {
      en: "Enterprise web application built during a professional internship. Automates candidate screening using an AI CV-parser model.",
      fr: "Application d'entreprise conçue en stage. Automatise le tri des candidats grâce à l'intégration d'un modèle d'IA de parsing de CV.",
    },
    tech: ["Next.js", "Node.js", "MongoDB", "AI Parsing", "REST API", "Docker"],
    demoUrl: "https://beinterim-demo-production.up.railway.app",
    codeUrl: "https://github.com/bakk04",
  },
  {
    num: "04",
    id: "agromind",
    name: "AgroMind Edge AI",
    tag: "IoT & TinyML",
    color: "#34d399", // Teal
    year: "2026",
    metrics: ["TinyML ESP32", "Water Savings: +25%", "HiveMQ MQTT"],
    desc: {
      en: "Smart agricultural irrigation system powered by Edge Computing and TinyML models deployed directly on ESP32 microcontrollers.",
      fr: "Système d'irrigation intelligente alimenté par Edge Computing et modèles TinyML déployés sur microcontrôleurs ESP32.",
    },
    tech: ["React Native", "Python", "C++", "MQTT", "HiveMQ", "TinyML"],
    demoUrl: "https://github.com/bakk04/AgroMind",
    codeUrl: "https://github.com/bakk04/AgroMind",
  },
];

const TIMELINE = [
  {
    year: "09/2024 – Present",
    type: "edu" as const,
    title: {
      en: "Engineering Degree in Software Engineering",
      fr: "Diplôme d'Ingénieur en Informatique et Systèmes d'Information"
    },
    place: "EMSI Rabat (École Marocaine des Sciences de l'Ingénieur)",
    desc: {
      en: "Currently in 4th Year. Focused on advanced software design, enterprise architecture, distributed computing, and artificial intelligence. Top of the Class (Majorant).",
      fr: "Actuellement en 4ème année. Spécialisation en design logiciel avancé, bases de données complexes et intégration d'IA. Major de promotion."
    }
  },
  {
    year: "07/2024 – 08/2024",
    type: "work" as const,
    title: {
      en: "Full Stack Developer & AI Intern",
      fr: "Stagiaire Développeur Full Stack & IA"
    },
    place: "Beinterim — Salé, Maroc",
    desc: {
      en: "Developed candidate-matching platform features. Integrated an AI-driven CV parser (85% accuracy) reducing recruitment screening duration by 40%. Designed robust REST APIs with 100% stage uptime.",
      fr: "Développement de modules de recrutement. Intégration d'un parsing de CV par IA (85% d'extraction), divisant le temps de tri par 40%. Création d'API REST résilientes sans interruption."
    }
  },
  {
    year: "09/2022 – 06/2024",
    type: "edu" as const,
    title: {
      en: "Integrated Preparatory Classes",
      fr: "Classes Préparatoires Intégrées"
    },
    place: "EMSI | Rabat",
    desc: {
      en: "Intensive focus on engineering sciences, computational physics, advanced linear algebra, and data structures.",
      fr: "Cycle préparatoire intensif en sciences de l'ingénieur, physique, algèbre et algorithmique fondamentale."
    }
  }
];

const CERTS = [
  { name: "Python Data Science", issuer: "Coursera", year: "2024", color: "#38bdf8" },
  { name: "React Native & Android Native", issuer: "Coursera", year: "2024", color: "#60a5fa" },
  { name: "Agile / Scrum Methodologies", issuer: "Certifié", year: "2024", color: "#10b981" },
  { name: "Programmation C++", issuer: "EPFL", year: "2023", color: "#34d399" },
];

// ─── Upgraded RAG Q&A Token-Matching Engine ───────────────────
function answerQuestion(query: string, lang: Lang): { text: string; source: string } {
  const q = query.toLowerCase().trim();
  const keywords = {
    education: ["emsi", "school", "study", "studies", "education", "formation", "etude", "diplome", "diplôme", "ingénieur", "ingénierie", "prepa", "prépa", "rank", "majorant", "class", "classes", "prep"],
    experience: ["beinterim", "stage", "intern", "work", "experience", "job", "professionnel", "recrutement", "candidat", "screening", "cv-parser", "parsing", "parse"],
    projects: ["project", "projet", "agromind", "sehati", "bricole", "artisan", "iot", "irrigation", "tinyml", "marketplace", "medtech", "heart", "rppg", "state-space", "ssm", "sensor", "mqtt", "hivemq"],
    skills: ["skills", "skill", "competence", "compétence", "stack", "techno", "react", "next", "django", "python", "java", "c++", "database", "docker", "git", "back end", "front end", "oracle", "sql", "postgresql", "mysql", "programming"],
    contact: ["contact", "hire", "email", "phone", "locate", "mail", "téléphone", "adresse", "linkedin", "github", "bakk04", "location", "address", "reach", "write"]
  };

  const scores = { education: 0, experience: 0, projects: 0, skills: 0, contact: 0 };
  const tokens = q.split(/[\s,?.!/()_-]+/);
  tokens.forEach(token => {
    if (!token) return;
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => word === token || token.includes(word))) {
        scores[category as keyof typeof scores] += 2;
      }
    }
  });

  const maxScore = Math.max(...Object.values(scores));
  const bestCategory = maxScore > 0 ? (Object.keys(scores) as Array<keyof typeof scores>).find(cat => scores[cat] === maxScore) : null;

  if (bestCategory === "education") {
    return {
      text: lang === "en"
        ? "Younes Bakkali Terghi is currently a 4th-year Software Engineering & Information Systems student at EMSI (École Marocaine des Sciences de l'Ingénieur) in Rabat. He is the top student in his class (Majorant). Prior to this, he completed Classes Préparatoires Intégrées (Sciences de l'Ingénieur) from 2022 to 2024 at EMSI."
        : "Younes est élève ingénieur de 4ème année à l'EMSI (École Marocaine des Sciences de l'Ingénieur) à Rabat, au sein du cursus Informatique et Systèmes d'Information. Il est Major de sa promotion. Auparavant, il a suivi le cycle préparatoire intégré (2022-2024) à l'EMSI.",
      source: "YBT_CV [Section: Education]"
    };
  }
  if (bestCategory === "experience") {
    return {
      text: lang === "en"
        ? "Younes completed an internship as a Full Stack Developer & AI Intern at Beinterim in Salé, Morocco, from July to August 2024. He developed a full-stack platform that reduced CV screening times by 40%, integrated a Machine Learning CV parsing model achieving an 85% extraction accuracy, and built REST APIs with 100% stage uptime."
        : "Younes a fait un stage de Développeur Full Stack & IA chez Beinterim (Salé, Maroc) de juillet à août 2024. Il y a créé une solution divisant le temps de tri des candidatures de 40%, intégrant un parsing par IA (85% d'extraction) et des architectures d'API REST haute fiabilité.",
      source: "YBT_CV [Section: Experience]"
    };
  }
  if (bestCategory === "projects") {
    return {
      text: lang === "en"
        ? "Younes has developed key systems:\n1. **Sehati**: A health-tech PWA executing heart rate tracking models (rPPG State-Space Models) locally at 60 FPS.\n2. **Bricole.ma**: A marketplace PWA managing over 500 local artisans in real-time.\n3. **Beinterim Platform**: An intelligent HR tool integrating 85%-accurate AI CV parsing.\n4. **AgroMind Edge AI**: An agricultural IoT irrigation project built using ESP32, TinyML, and MQTT/HiveMQ, reducing water usage by 25%."
        : "Younes a conçu plusieurs projets technologiques :\n1. **Sehati** : Une PWA MedTech avec modèles d'espace d'états (rPPG) s'exécutant à 60 FPS localement.\n2. **Bricole.ma** : Une marketplace d'artisans avec base de données temps réel de 500+ prestataires.\n3. **Plateforme Beinterim** : Outil RH de tri automatisé des CV par IA avec 85% de précision.\n4. **AgroMind Edge AI** : Système IoT d'irrigation intelligente avec TinyML sur ESP32, économisant 25% d'eau via MQTT.",
      source: "YBT_CV [Section: Projects]"
    };
  }
  if (bestCategory === "skills") {
    return {
      text: lang === "en"
        ? "Younes' technical competencies span:\n• **Languages & Back End**: Java (Spring Boot), Python (Django, FastAPI), C++, ASP.NET, Ruby, REST APIs\n• **Front End**: HTML, JS, Next.js, React.js, Tailwind CSS, Framer Motion\n• **Databases**: Oracle, SQL Server, PostgreSQL, MySQL\n• **Tools & DevOps**: Git, Docker, Agile/Scrum methodologies."
        : "Les compétences de Younes s'articulent autour de :\n• **Langages & Back End** : Java (Spring Boot), Python (Django, FastAPI), C++, ASP.NET, Ruby, API REST\n• **Front End** : HTML, JS, Next.js, React.js, Tailwind CSS, Framer Motion\n• **Bases de données** : Oracle, SQL Server, PostgreSQL, MySQL\n• **Outils/DevOps** : Git, Docker, méthodologies Agile/Scrum.",
      source: "YBT_CV [Section: Technical Skills]"
    };
  }
  if (bestCategory === "contact") {
    return {
      text: lang === "en"
        ? "Younes is located in Rabat-Salé, Morocco. You can reach him by email at **younessbakkali09@gmail.com**, phone him at **+212 628503265**, visit his profile at **linkedin.com/in/younes-bakkali-terghi**, or check his repositories at **github.com/bakk04**."
        : "Younes habite dans l'axe Rabat-Salé, au Maroc. Contactez-le via **younessbakkali09@gmail.com**, par téléphone au **+212 628503265** ou retrouvez son profil sur **linkedin.com/in/younes-bakkali-terghi**.",
      source: "YBT_CV [Header Context]"
    };
  }
  return {
    text: lang === "en"
      ? "I am configured as Younes' secure RAG Agent. I can provide details regarding his experience, projects, skills, and studies. Please enter your query."
      : "Je suis l'assistant RAG sécurisé de Younes. Je peux répondre à vos questions concernant ses compétences, ses projets, son parcours, ou ses études.",
    source: "System Core Database"
  };
}

// ─── GlobalStyles (Clean, Google & Apple Luxury Styling) ───
function GlobalStyles() {
  return (
    <style>{`
      *  { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
      ::selection { background: rgba(59, 130, 246, 0.15); color: inherit; }

      .char-anim {
        display: inline-block;
        animation: char-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        transform-origin: bottom center;
      }
      .char-space { display: inline-block; width: 0.28em; }

      .glass-card {
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(226, 232, 240, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
      }
      .dark .glass-card {
        background: rgba(10, 10, 12, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.04);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      }
      .glass-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(96, 165, 250, 0.15);
      }
      .dark .glass-card:hover {
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35), 0 0 25px rgba(96, 165, 250, 0.03);
      }

      .btn-primary {
        position: relative;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }
      .btn-primary:hover {
        transform: translateY(-1.5px);
        box-shadow: 0 12px 30px rgba(59, 130, 246, 0.2);
      }

      .gradient-text {
        background: linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #10b981 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .section-label {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-weight: 700;
      }
      .section-label::before {
        content: "";
        display: inline-block;
        width: 1.2rem;
        height: 1.5px;
        background: var(--primary);
        border-radius: 2px;
      }

      .contact-input {
        width: 100%;
        background: rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 0.75rem;
        padding: 0.9rem 1.2rem;
        color: var(--foreground);
        outline: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: var(--font-body);
        font-size: 0.85rem;
      }
      .dark .contact-input {
        background: rgba(255, 255, 255, 0.02);
        border-color: rgba(255, 255, 255, 0.06);
      }
      .contact-input:focus {
        border-color: var(--primary);
        background: transparent;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
      }

      @keyframes float-y {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-8px); }
      }
      .floating { animation: float-y 6s ease-in-out infinite; }

      @keyframes marquee {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
      }
      .animate-marquee {
        display: flex;
        width: max-content;
        animation: marquee 30s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}</style>
  );
}

// ─── Active Section Intersection Observer Hook ────────────
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] || "");
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-30% 0px -30% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

// ─── Staggered Neon Character Reveal Component ───────────────
function StaggerText({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-[0.22em] whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + wIdx * 0.15 + cIdx * 0.035,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

// ─── Magnetic Button Props & Logic ─────────────────────────
interface HeroMagneticBtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
}

function HeroMagneticBtn({ onClick, children, primary }: HeroMagneticBtnProps) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.15;
    const y = (e.clientY - r.top  - r.height / 2) * 0.15;
    el.style.transform = `translate3d(${x}px,${y}px,0) scale(1.025)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0,0,0) scale(1)";
      ref.current.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }, []);

  const onEnter = useCallback(() => {
    if (ref.current) {
      ref.current.style.transition = "none";
    }
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group relative px-6 py-3.5 sm:px-8 sm:py-4.5 rounded-full font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95 border ${
        primary
          ? "bg-slate-900 text-white border-transparent shadow-[0_4px_25px_rgba(59,130,246,0.25)] dark:bg-white dark:text-slate-950 dark:shadow-[0_4px_25px_rgba(255,255,255,0.1)] font-extrabold hover:shadow-[0_4px_35px_rgba(59,130,246,0.4)]"
          : "bg-transparent text-foreground border-black/15 dark:border-white/15 hover:border-blue-500/40 hover:bg-black/5 dark:hover:bg-white/5"
      }`}
      style={{ willChange: "transform" }}
    >
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
}

// ─── Modern Code-Wrapped Developer Name Component ────────────
function ModernDevelopmentName({ lang }: { lang: Lang }) {
  return (
    <div className="tracking-tight leading-[1.0] mb-6 select-none text-left">
      <div className="flex items-center gap-2 mb-3.5">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
          {lang === "en" ? "System Core // Developer" : "Noyau Système // Développeur"}
        </span>
        <span className="h-px w-10 bg-slate-350 dark:bg-white/10" />
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 text-[24px] xs:text-[32px] sm:text-5xl md:text-6xl lg:text-6.5xl font-black font-display text-slate-900 dark:text-white leading-[1.1]">
        <span className="text-blue-500 font-mono text-xl sm:text-3.5xl md:text-4.5xl select-none">&lt;</span>
        <span className="inline-block relative">
          <StaggerText text="Younes Bakkali Terghi" delay={0.2} />
        </span>
        <span className="text-blue-500 font-mono text-xl sm:text-3.5xl md:text-4.5xl select-none">/&gt;</span>
      </div>
    </div>
  );
}

// ─── Mobile Typewriter Effect ─────────────────────────────
function MobileTypewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index, words]);

  return (
    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-extrabold text-[11px] sm:text-xs">
      {words[index].substring(0, subIndex)}
      <span className={`inline-block w-1.5 h-3 bg-cyan-600 dark:bg-cyan-400 ml-0.5 ${blink ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}

// ─── Cyber-Futuristic Mobile-Only Hero Layout ─────────────
function MobileHeroSection({ lang, onNavigate }: { lang: Lang; onNavigate: (id: string) => void }) {
  const t = T[lang];
  const typewriterWords = lang === "en"
    ? ["Software Engineer", "Full Stack Developer", "Networks & Systems Specialist", "EMSI Majorant (1st)"]
    : ["Ingénieur Logiciel", "Développeur Full Stack", "Spécialiste Systèmes & Réseaux", "Major de Promotion EMSI"];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground px-6 py-20 select-none transition-colors duration-500">
      {/* 3D Visual on Mobile (Interactive Rotating Globe Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-65 dark:opacity-40">
        <InteractiveScene3D />
      </div>

      {/* Slow-drifting GPU-accelerated CSS Auroras (highly visible, comfortable, and modern) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] opacity-25 dark:opacity-30">
        <div 
          className="absolute w-[80vw] h-[80vw] rounded-full top-[-20%] left-[-20%] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent blur-[100px] animate-pulse" 
          style={{ animationDuration: "10s" }} 
        />
        <div 
          className="absolute w-[70vw] h-[70vw] rounded-full bottom-[-10%] right-[-10%] bg-gradient-to-tr from-emerald-500/15 via-blue-600/5 to-transparent blur-[100px] animate-pulse" 
          style={{ animationDuration: "14s" }} 
        />
      </div>

      {/* Ambient vignette behind text to ensure 100% contrast and readability */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/40 to-background/90 z-[2] pointer-events-none transition-colors duration-500" />

      {/* Spacious, Comfortable Content Panel */}
      <div className="w-full max-w-sm flex flex-col items-center text-center relative z-10 gap-8 mt-8">
        
        {/* Minimalist Available Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.03] text-[9px] uppercase tracking-widest font-mono text-emerald-650 dark:text-emerald-450 font-bold"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          {t.available}
        </motion.div>

        {/* Developer Title Block */}
        <div className="flex flex-col items-center gap-2 w-full">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-[9px] font-mono tracking-[0.3em] uppercase text-slate-500 dark:text-slate-400 font-semibold"
          >
            {lang === "en" ? "// CORE PROTOCOL" : "// SYSTEME"}
          </motion.span>
          
          {/* Main Developer Name - Styled clean, bold, theme-responsive */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] w-full"
          >
            Younes Bakkali Terghi
          </motion.h1>

          {/* Majorant Sub-label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="text-[9px] font-mono tracking-[0.25em] text-cyan-600 dark:text-cyan-400 font-bold uppercase mt-1"
          >
            {lang === "en" ? "EMSI Rank 1 Majorant" : "Major de Promo EMSI (1er)"}
          </motion.div>
        </div>

        {/* Roles Terminal Line - Streamlined & Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="flex items-center justify-center font-mono text-[11px] gap-2 py-1 px-4 border border-slate-200 dark:border-white/5 bg-slate-500/[0.03] dark:bg-white/[0.02] backdrop-blur-md rounded-full text-slate-700 dark:text-slate-300 font-semibold shadow-sm"
        >
          <span className="text-slate-400 dark:text-slate-500 font-black">&gt;</span>
          <MobileTypewriter words={typewriterWords} />
        </motion.div>

        {/* Biography Block - Highly readable font */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 font-sans max-w-[310px] select-text"
        >
          {lang === "en"
            ? "Architecting high-performance distributed systems, TinyML Edge computation nodes, and deep AI model integrations."
            : "Spécialiste de la conception d'architectures distribuées, de l'IA embarquée et des services web haut de gamme."}
        </motion.p>

        {/* Premium CTA Buttons Group */}
        <div className="flex flex-col gap-3 w-full max-w-[300px] mt-2">
          
          {/* Download CV */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full"
          >
            <a 
              href="/CV_Younes_Bakkali_Terghi.pdf" 
              download="CV_Younes_Bakkali_Terghi.pdf"
              className="relative py-4 rounded-2xl font-sans text-xs tracking-wider text-emerald-600 dark:text-emerald-450 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03] border border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500/50 shadow-sm flex items-center justify-center cursor-pointer select-none active:scale-[0.98] transition-all duration-300 w-full font-bold overflow-hidden group"
            >
              <span className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="mr-2.5 transition-transform duration-300 group-hover:translate-y-0.5 text-emerald-600 dark:text-emerald-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              {lang === "en" ? "Download CV" : "Télécharger le CV"}
            </a>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full"
          >
            <button 
              onClick={() => onNavigate("contact")}
              className="relative py-4 rounded-2xl font-sans text-xs tracking-wider text-white bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-400/20 shadow-md flex items-center justify-center cursor-pointer select-none active:scale-[0.98] transition-all duration-300 w-full font-bold group"
            >
              {lang === "en" ? "Let's Connect" : "Me Contacter"}
              <svg className="ml-2.5 transition-transform duration-300 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.div>

        </div>

        {/* Minimal Social Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex justify-center gap-6 text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 mt-2 select-none"
        >
          <a href="https://github.com/bakk04" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">GITHUB</a>
          <span>•</span>
          <a href="https://linkedin.com/in/younes-bakkali-terghi" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">LINKEDIN</a>
        </motion.div>

      </div>
    </section>
  );
}

// ─── Luxurious Apple-Style Hero (Google AI Wave Mesh Background) ──
function HeroSection({ lang, onNavigate }: { lang: Lang; onNavigate: (id: string) => void }) {
  const t = T[lang];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileHeroSection lang={lang} onNavigate={onNavigate} />;
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic waving color mesh backdrop */}
      <GeminiWaveMesh />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-36 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Available Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border text-[9.5px] uppercase tracking-wider font-mono font-bold bg-blue-500/[0.04] text-blue-600 dark:text-blue-400 border-blue-500/25 shadow-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
              </span>
              {t.available}
            </motion.div>

            {/* Code-Wrapped Name display */}
            <ModernDevelopmentName lang={lang} />

            {/* Specialty Label - Professional subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
              className="text-xs sm:text-sm md:text-sm font-bold font-mono tracking-wider mb-6 text-slate-800 dark:text-slate-200 select-none uppercase border-l-2 border-blue-500 pl-4 py-1"
            >
              Software Engineer | Full Stack Developer | Networks & Systems Engineer
            </motion.p>

            {/* Short Biography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.15 }}
              className="text-xs md:text-sm leading-relaxed opacity-85 text-muted-foreground font-body mb-8 select-none max-w-2xl"
            >
              {lang === "en"
                ? "4th-Year Software Engineering Majorant (1st of Prom) at EMSI Rabat. Architecting high-performance distributed systems, TinyML Edge computation nodes, and deep AI model integrations."
                : "Élève Ingénieur de 4ème Année & Major de Promotion (1er) à l'EMSI Rabat. Spécialiste de la conception d'architectures distribuées, de l'IA embarquée et des services web haut de gamme."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
              className="flex flex-wrap gap-4"
            >
              {/* Projects CTA */}
              <HeroMagneticBtn onClick={() => onNavigate("projects")} primary>
                {t.heroCta1}
                <svg className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </HeroMagneticBtn>

              {/* CV Download CTA */}
              <a 
                href="/CV_Younes_Bakkali_Terghi.pdf" 
                download="CV_Younes_Bakkali_Terghi.pdf"
                className="group relative px-5.5 py-3.5 sm:px-7 sm:py-4.5 rounded-full font-mono text-[11px] uppercase tracking-[0.22em] border border-[#10b981]/30 hover:border-[#10b981]/60 bg-transparent text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.02)] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]"
              >
                <svg className="mr-2.5 group-hover:translate-y-0.5 transition-transform" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {lang === "en" ? "Download CV" : "Télécharger CV"}
              </a>

              {/* GitHub Link CTA */}
              <a 
                href="https://github.com/bakk04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-5.5 py-3.5 sm:px-7 sm:py-4.5 rounded-full font-mono text-[11px] uppercase tracking-[0.22em] border border-black/15 dark:border-white/15 hover:border-blue-500/40 hover:bg-black/5 dark:hover:bg-white/5 text-foreground transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95"
              >
                <svg className="mr-2.5 w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </a>

              {/* Contact Me CTA */}
              <button 
                onClick={() => onNavigate("contact")}
                className="group relative px-5.5 py-3.5 sm:px-7 sm:py-4.5 rounded-full font-mono text-[11px] uppercase tracking-[0.22em] border border-black/10 dark:border-white/10 hover:border-blue-500/40 bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95"
              >
                {t.heroCta2}
              </button>
            </motion.div>
          </div>

          {/* Right Stunning Animated Column */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="w-full flex justify-center"
            >
              <InteractiveScene3D />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Skills Marquee (Infinite scroll) ─────────────────────────
function SkillsMarquee() {
  const marqueeItems = [
    "Next.js",
    "Django",
    "FastAPI",
    "React",
    "Java / Spring Boot",
    "TinyML",
    "IoT (ESP32/MQTT)",
    "RAG Systems",
  ];

  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="relative w-full overflow-hidden py-6 bg-black/5 dark:bg-white/[0.02] border-y border-black/5 dark:border-white/[0.06] select-none z-10">
      <div className="flex w-max animate-marquee">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 mx-8 font-display text-[10px] md:text-xs font-bold tracking-wider uppercase font-mono"
            style={{ color: "var(--foreground)" }}
          >
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About Section (Visual Bento Grid Layout) ─────────────────
function AboutSection({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <CinematicScrollReveal direction="up" intensity="cinematic">
          
          <div className="section-label mb-6">{t.aboutLabel}</div>
          <h2 className="mb-4 font-extrabold tracking-tight text-4xl sm:text-5xl font-display leading-tight">
            {t.aboutTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Cell 1: Bio */}
            <div className="md:col-span-2">
              <PerspectiveCard maxTilt={3} className="p-5.5 sm:p-8 flex flex-col gap-5 h-full justify-center">
                <h3 className="text-lg font-bold tracking-tight font-display leading-snug">
                  {lang === "en" 
                    ? "Designing robust server architectures and elegant intelligent frontends." 
                    : "Création d'architectures serveurs robustes et d'interfaces intelligentes."}
                </h3>
                <p className="text-xs leading-7 text-muted-foreground font-body">
                  {t.aboutBio1}
                </p>
                <p className="text-xs leading-7 text-muted-foreground font-body">
                  {t.aboutBio2}
                </p>
              </PerspectiveCard>
            </div>

            {/* Cell 2: Major de promotion */}
            <div>
              <PerspectiveCard maxTilt={5} className="p-5.5 sm:p-8 flex flex-col justify-between h-full bg-gradient-to-br from-blue-500/[0.03] to-transparent dark:from-blue-950/10">
                <Award className="w-6 h-6 text-blue-500 mb-8" />
                <div>
                  <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-1.5 tracking-tight font-display">
                    1st
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Class Rank (Major de Promo)
                  </div>
                  <p className="text-[9px] text-slate-400/60 font-mono mt-1 leading-normal">
                    EMSI Rabat
                  </p>
                </div>
              </PerspectiveCard>
            </div>

            {/* Cell 3: Tokenizer Simulation */}
            <div className="md:col-span-2">
              <TokenizerPlayground />
            </div>

            {/* Cell 4: Numeric Stats */}
            <div className="grid grid-cols-2 gap-4">
              <PerspectiveCard maxTilt={6} className="p-4.5 sm:p-6 flex flex-col justify-between h-full bg-gradient-to-br from-emerald-500/[0.03] to-transparent dark:from-emerald-950/10">
                <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold tracking-wider">// PROJECTS</span>
                <div>
                  <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none">10+</div>
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 font-mono mt-2">Completed</div>
                </div>
              </PerspectiveCard>
              
              <PerspectiveCard maxTilt={6} className="p-4.5 sm:p-6 flex flex-col justify-between h-full bg-gradient-to-br from-cyan-500/[0.03] to-transparent dark:from-cyan-950/10">
                <span className="text-cyan-600 dark:text-cyan-400 text-[9px] font-mono font-bold tracking-wider">// STAGE</span>
                <div>
                  <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400 leading-none">1</div>
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 font-mono mt-2">Internship</div>
                </div>
              </PerspectiveCard>
            </div>

          </div>
        </CinematicScrollReveal>
      </div>
    </section>
  );
}

// ─── Skills Section (Neural network Flow) ──────────────────────
// (Modular Skills component is loaded from components/Skills)

// ─── Projects Section (Sleek visual layouts & stats) ──────────
function ProjectsSection({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <CinematicScrollReveal direction="up" intensity="cinematic">
          <div className="section-label mb-6">{t.projectsLabel}</div>
          <h2
            className="mb-12 font-extrabold tracking-tight text-4xl sm:text-5xl font-display"
            style={{ lineHeight: 1.15 }}
          >
            {t.projectsTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((proj, i) => (
              <div key={i}>
                <ProjectCard proj={proj} lang={lang} t={{ viewProject: t.viewProject, viewCode: t.viewCode }} />
              </div>
            ))}
          </div>
        </CinematicScrollReveal>
      </div>
    </section>
  );
}

function ProjectCard({
  proj, lang, t,
}: {
  proj: typeof PROJECTS[0];
  lang: Lang;
  t: { viewProject: string; viewCode: string };
}) {
  return (
    <PerspectiveCard
      maxTilt={4}
      glareOpacity={0.08}
      className="p-5.5 sm:p-8 flex flex-col gap-5 h-full relative overflow-hidden group"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${proj.color}10, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <span
            className="block text-[9px] font-bold mb-1 font-mono tracking-wider"
            style={{ color: proj.color }}
          >
            {proj.num}
          </span>
          <h3 className="text-base font-bold font-display text-foreground leading-tight">
            {proj.name}
          </h3>
        </div>
        <span
          className="shrink-0 text-[8px] font-extrabold px-3 py-1 rounded-full border"
          style={{
            fontFamily: "var(--font-mono)",
            background: `${proj.color}10`,
            color: proj.color,
            borderColor: `${proj.color}20`,
          }}
        >
          {proj.tag}
        </span>
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-white/[0.04]" />

      <p className="text-[11px] leading-6 flex-1 opacity-80 text-muted-foreground font-body">
        {proj.desc[lang]}
      </p>

      {/* Embedded interactive canvas waveforms for Sehati */}
      {proj.id === "sehati" && (
        <div className="my-1 relative z-20">
          <TelemetryWave />
        </div>
      )}

      {/* IoT Status block for AgroMind */}
      {proj.id === "agromind" && (
        <div className="my-1 bg-[#09090b] border border-white/5 p-3.5 sm:p-4 rounded-xl font-mono text-[8.5px] text-slate-400 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center select-none relative z-20">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-emerald-400 font-bold">// ESP32 NODE STATUS</span>
            <span>SOIL_MOISTURE: 42.4%</span>
            <span>OUTFLOW: 0.12 L/s</span>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 w-full sm:w-auto border-t border-white/[0.04] sm:border-0 pt-2 sm:pt-0">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[7.5px] text-emerald-400 font-bold">IRRIGATING: OFF</span>
            <span className="text-slate-500">SAVINGS: +25%</span>
          </div>
        </div>
      )}

      {/* Metrics Badges - Visually appealing stats */}
      <div className="flex flex-wrap gap-1.5 my-1">
        {proj.metrics.map((metric, idx) => (
          <span
            key={idx}
            className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10"
          >
            {metric}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 relative z-10">
        {proj.tech.map((tech) => (
          <span
            key={tech}
            className="text-[9px] px-2.5 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.03] font-mono text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2 relative z-10">
        {proj.demoUrl && (
          <a
            href={proj.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8.5 px-4 rounded-full text-[9.5px] font-bold flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.02]"
            style={{ fontFamily: "var(--font-body)", background: proj.color, color: "#000000" }}
          >
            {t.viewProject}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <a
          href={proj.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8.5 px-4 rounded-full text-[9.5px] font-bold flex items-center gap-1.5 border border-black/10 dark:border-white/10 bg-transparent transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground"
        >
          {t.viewCode}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </a>
        <span className="ml-auto text-[9.5px] font-mono text-muted-foreground opacity-60">{proj.year}</span>
      </div>
    </PerspectiveCard>
  );
}

// ─── Journey Section (Timeline) ───────────────────────────────
function TimelineSection({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <section id="timeline" className="py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <CinematicScrollReveal direction="up" intensity="cinematic">
          <div className="section-label mb-6">{t.timelineLabel}</div>
          <h2
            className="mb-12 font-extrabold tracking-tight text-4xl sm:text-5xl font-display"
            style={{ lineHeight: 1.15 }}
          >
            {t.timelineTitle}
          </h2>

          <div className="relative">
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800"
              style={{
                background: "linear-gradient(to bottom, var(--primary) 30%, var(--border) 70%, transparent)",
                transform: "translateX(-50%)"
              }}
            />

            <div className="flex flex-col gap-10">
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Card */}
                    <div
                      className={`flex-1 pl-8 md:pl-0 ${isLeft ? "md:pr-12" : "md:pl-12"} ${isLeft ? "md:text-right" : "md:text-left"}`}
                    >
                      <PerspectiveCard maxTilt={4} className="p-5.5 sm:p-6 inline-block w-full md:max-w-md">
                        <div className={`flex items-center gap-2 mb-2.5 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                          <span
                            className="text-[8px] px-2.5 py-0.5 rounded-full border uppercase font-bold font-mono"
                            style={{
                              background: item.type === "work" ? "rgba(59,130,246,0.06)" : "rgba(16,185,129,0.06)",
                              color: item.type === "work" ? "#3b82f6" : "#10b981",
                              borderColor: item.type === "work" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)",
                            }}
                          >
                            {item.type === "work" ? "↗ Stage" : "◎ Formation"}
                          </span>
                          <span className="text-[9px] opacity-75 font-semibold font-mono text-muted-foreground ml-2 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold mb-1 text-foreground font-display">
                          {item.title[lang]}
                        </h3>
                        <p
                          className="text-[9px] mb-2.5 uppercase tracking-wide font-bold font-mono"
                          style={{ color: "var(--primary)" }}
                        >
                          {item.place}
                        </p>
                        <p className="text-[11px] leading-6 text-left text-muted-foreground font-body">
                          {item.desc[lang]}
                        </p>
                      </PerspectiveCard>
                    </div>

                    {/* dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 flex-shrink-0 mt-6 transition-all duration-300"
                      style={{
                        borderColor: "var(--primary)",
                        background: "var(--background)",
                        boxShadow: "0 0 8px var(--primary)",
                      }}
                    />

                    <div className="hidden md:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </CinematicScrollReveal>
      </div>
    </section>
  );
}

// ─── Certifications Section ───────────────────────────────────
function CertificationsSection({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <CinematicScrollReveal direction="up" intensity="cinematic">
          <div className="section-label mb-6">{t.certsLabel}</div>
          <h2
            className="mb-12 font-extrabold tracking-tight text-4xl sm:text-5xl font-display"
            style={{ lineHeight: 1.15 }}
          >
            {t.certsTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((cert, i) => (
              <div key={i}>
                <PerspectiveCard maxTilt={5} className="p-5 flex items-start gap-4 h-full">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center border border-slate-100 dark:border-slate-800"
                    style={{ background: `${cert.color}12` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: cert.color, boxShadow: `0 0 8px ${cert.color}` }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[10px] leading-snug mb-1 uppercase tracking-wide font-mono text-foreground">
                      {cert.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body">
                      {cert.issuer}
                    </p>
                    <span
                      className="inline-block mt-2 text-[8px] font-mono font-medium"
                      style={{ color: cert.color, opacity: 0.85 }}
                    >
                      {cert.year}
                    </span>
                  </div>
                </PerspectiveCard>
              </div>
            ))}
          </div>
        </CinematicScrollReveal>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────
function ContactSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <CinematicScrollReveal direction="up" intensity="cinematic">
          <div className="section-label mb-6">{t.contactLabel}</div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2
                className="font-extrabold tracking-tight text-3xl sm:text-4xl font-display text-slate-900 dark:text-white"
                style={{ lineHeight: 1.15 }}
              >
                {t.contactTitle}
              </h2>
              <p className="text-xs.5 text-muted-foreground font-body leading-relaxed max-w-xl">
                {t.contactDesc}
              </p>

              <div className="w-full mt-4">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-4 text-center border border-emerald-500/20 bg-emerald-500/[0.02] shadow-[0_10px_30px_rgba(16,185,129,0.06)]">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 animate-bounce"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <p className="font-bold text-[12.5px] tracking-wide font-mono text-emerald-600 dark:text-emerald-400">
                        {t.contactSent}
                      </p>
                    </div>
                  ) : (
                    <PerspectiveCard maxTilt={2} className="p-7 flex flex-col gap-5">
                      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase font-bold tracking-[0.18em] text-slate-450 dark:text-slate-500 font-mono">
                            {t.contactName}
                          </label>
                          <input
                            required
                            type="text"
                            className="contact-input animate-none"
                            placeholder="Younes Bakkali Terghi"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase font-bold tracking-[0.18em] text-slate-450 dark:text-slate-500 font-mono">
                            {t.contactEmail}
                          </label>
                          <input
                            required
                            type="email"
                            className="contact-input animate-none"
                            placeholder="younessbakkali09@gmail.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase font-bold tracking-[0.18em] text-slate-450 dark:text-slate-500 font-mono">
                            {t.contactMsg}
                          </label>
                          <textarea
                            required
                            rows={4}
                            className="contact-input resize-none animate-none"
                            placeholder="Tell me about your project..."
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={sending}
                          className="btn-primary mt-2 h-11.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer select-none"
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            opacity: sending ? 0.7 : 1,
                            cursor: sending ? "wait" : "pointer",
                          }}
                        >
                          {sending ? (
                            <>
                              <svg
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                className="animate-spin"
                              >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                              </svg>
                              Sending…
                            </>
                          ) : (
                            <>
                              {t.contactSend}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                              </svg>
                            </>
                          )}
                        </button>
                      </form>
                    </PerspectiveCard>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Contact info details */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6 w-full h-full justify-center">
              <PerspectiveCard maxTilt={3} className="p-5.5 sm:p-8 flex flex-col gap-6.5 bg-gradient-to-br from-blue-500/[0.02] to-transparent dark:from-blue-950/[0.05]">
                
                <div className="border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <span className="text-[10px] font-mono tracking-widest text-blue-500 dark:text-blue-400 uppercase font-bold">
                    // CONTACT_CHANNELS
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mt-1">
                    {lang === "en" ? "Direct Info" : "Coordonnées Directes"}
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 bg-slate-900/5 dark:bg-white/[0.02] text-blue-500 shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">// TELEPHONE</p>
                      <a href="tel:+212628503265" className="text-[13px] font-bold text-slate-800 dark:text-slate-200 hover:text-blue-500 transition-colors font-body mt-0.5 block">+212 628503265</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 bg-slate-900/5 dark:bg-white/[0.02] text-blue-500 shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">// EMAIL_PORT</p>
                      <a href="mailto:younessbakkali09@gmail.com" className="text-[13px] font-bold text-slate-800 dark:text-slate-200 hover:text-blue-500 transition-colors font-body mt-0.5 block break-all">younessbakkali09@gmail.com</a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 bg-slate-900/5 dark:bg-white/[0.02] text-blue-500 shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">// LOCATION</p>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 font-body mt-0.5">Rabat - Salé, Maroc</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/[0.04] dark:border-white/[0.04] pt-5.5 flex gap-4 justify-start">
                  {/* Github profile */}
                  <a 
                    href="https://github.com/bakk04" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-xl border border-black/5 dark:border-white/5 bg-slate-900/5 dark:bg-white/[0.02] hover:bg-blue-500/10 hover:border-blue-500/30 text-slate-650 dark:text-slate-350 hover:text-blue-500 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  {/* LinkedIn Profile */}
                  <a 
                    href="https://linkedin.com/in/younes-bakkali-terghi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-black/5 dark:border-white/5 bg-slate-900/5 dark:bg-white/[0.02] hover:bg-blue-500/10 hover:border-blue-500/30 text-slate-650 dark:text-slate-350 hover:text-blue-500 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>

              </PerspectiveCard>
            </div>

          </div>
        </CinematicScrollReveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-8 border-t relative z-10 mt-16"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-5.5 h-5.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white"
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            Y
          </div>
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
            {t.footerBuilt}{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Younes Bakkali Terghi</span>
          </span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">
          © {year} — {t.footerRights}
        </span>
      </div>
    </footer>
  );
}

// ─── RAG AI Assistant Widget ──────────────────────────────────
function AiAssistant({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: lang === "en" 
          ? "Ask anything about Younes' software engineering credentials, education, projects, skills, or experience. I will extract details directly from his CV."
          : "Posez-moi vos questions sur le parcours de Younes (EMSI, stage Beinterim, projets AgroMind/Bricole/Sehati, ou compétences tech).",
        source: "System Core Database"
      }
    ]);
  }, [lang]);

  const handleSend = (text: string) => {
    if (!text.trim() || thinking) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setThinking(true);

    setTimeout(() => {
      const ans = answerQuestion(text, lang);
      setThinking(false);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: ans.text,
        source: ans.source
      }]);
    }, 1100);
  };

  const chips = lang === "en" 
    ? [
        { label: "Engineering Studies", q: "Tell me about his engineering studies at EMSI." },
        { label: "Beinterim Stage", q: "What did he build at Beinterim stage?" },
        { label: "AgroMind IoT", q: "Describe the AgroMind Edge AI IoT project." },
        { label: "Coding Stack", q: "What is his tech stack and coding skills?" }
      ]
    : [
        { label: "Études EMSI", q: "Quelles sont ses études d'ingénieur à l'EMSI Rabat ?" },
        { label: "Stage Beinterim", q: "Qu'a-t-il fait pendant son stage chez Beinterim ?" },
        { label: "Projet AgroMind", q: "Décris le projet IoT AgroMind Edge AI." },
        { label: "Stack Technique", q: "Quelles sont ses compétences techniques ?" }
      ];

  return (
    <>
      <AskYounesAi
        lang={lang}
        isOpen={open}
        onClose={() => setOpen(false)}
        messages={messages}
        onSend={handleSend}
        thinking={thinking}
        chips={chips}
      />

      <div className="fixed bottom-6 right-6 z-[997] select-none">
        {isMobile ? (
          /* Custom Futuristic Mobile Floating Button */
          <button
            onClick={() => setOpen(!open)}
            className="w-14 h-14 rounded-full flex items-center justify-center border border-cyan-500/40 bg-[#030303]/80 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.35)] relative active:scale-90 transition-transform cursor-pointer font-bold"
          >
            {/* Breathing ping rings */}
            <span className="absolute -inset-1.5 rounded-full border border-cyan-400/25 scale-100 animate-ping" style={{ animationDuration: "2.5s" }} />
            <span className="absolute -inset-3.5 rounded-full border border-blue-500/10 scale-95 animate-pulse" />

            {/* Small neon ping dot */}
            {!open && (
              <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            )}

            <div className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 animate-spin-slow scale-110" style={{ animationDuration: '7s' }} />
              {open ? (
                <X className="relative z-10 w-4 h-4 text-white animate-pulse" />
              ) : (
                <MessageSquare className="relative z-10 w-4 h-4 text-white" />
              )}
            </div>
          </button>
        ) : (
          /* Desktop Toggle Button */
          <button
            onClick={() => setOpen(!open)}
            className="w-14 h-14 rounded-full flex items-center justify-center border border-blue-500/20 dark:border-white/10 bg-white dark:bg-[#07070a] hover:scale-105 active:scale-95 transition-all shadow-[0_8px_32px_rgba(59,130,246,0.22)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-md relative group cursor-pointer"
          >
            {/* Breathing animated halos */}
            <span className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute -inset-2 rounded-full border border-blue-500/15 scale-100 group-hover:scale-110 opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
            <span className="absolute -inset-3.5 rounded-full border border-cyan-500/10 scale-95 group-hover:scale-105 opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse" style={{ animationDelay: "350ms" }} />

            {/* Small neon ping dot */}
            {!open && (
              <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
            )}

            {/* Outer rotating color ring */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 animate-spin-slow scale-110" style={{ animationDuration: '9s' }} />
              {open ? (
                <X className="relative z-10 w-4 h-4 text-white group-hover:scale-110 transition-transform animate-pulse" />
              ) : (
                <MessageSquare className="relative z-10 w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              )}
            </div>
          </button>
        )}
      </div>
    </>
  );
}

// ─── Main Content Wrapper inside provider ─────────────────────
function PortfolioContent() {
  const { theme, lang } = useModelSettings();
  const [loading, setLoading] = useState(true);
  const lenis = useLenis();
  const t = T[lang];
  const activeSection = useActiveSection(t.nav.map((n) => n.id));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleNavigate = useCallback(
    (id: string) => scrollToSection(id, lenis),
    [lenis]
  );

  return (
    <>
      <AnimatePresence>
        {loading && (
          <PreloaderModern onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div
        className="relative min-h-screen transition-colors duration-500"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
      <GlobalStyles />
      
      {/* Floating stardust grid */}
      <FuturisticBackground />

      <Header
        nav={t.nav}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Spacious Content */}
      <main className="relative z-10 w-full">
        <HeroSection lang={lang} onNavigate={handleNavigate} />
        <SkillsMarquee />
        <AboutSection lang={lang} />
        <Skills />
        <ProjectsSection lang={lang} />
        <TimelineSection lang={lang} />
        <CertificationsSection lang={lang} />
        <ContactSection lang={lang} />
        <Footer lang={lang} />
      </main>

      <AiAssistant lang={lang} />
      <BackToTopButton />
    </div>
    </>
  );
}

export default function App() {
  return (
    <ModelSettingsProvider>
      <SmoothScroll>
        <PortfolioContent />
      </SmoothScroll>
    </ModelSettingsProvider>
  );
}
