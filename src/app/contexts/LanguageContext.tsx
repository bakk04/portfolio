import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Hero
    'hero.title': 'Younes Bakkali Terghi',
    'hero.subtitle1': 'Élève Ingénieur en Informatique',
    'hero.subtitle2': 'Full Stack Developer & AI Enthusiast',
    'hero.description': 'Building intelligent software, AI-powered applications, and scalable architectures.',
    'hero.viewProjects': 'Voir les Projets',
    'hero.downloadCV': 'Télécharger CV',
    'hero.contact': 'Me Contacter',
    
    // About
    'about.title': 'À Propos',
    'about.description': 'Étudiant ingénieur passionné par le développement Full Stack, l\'Intelligence Artificielle et les architectures modernes. Je conçois des applications performantes, scalables et orientées expérience utilisateur.',
    'about.projects': 'Projets',
    'about.technologies': 'Technologies',
    'about.years': 'Années d\'apprentissage',
    'about.certificates': 'Certificats',
    
    // Skills
    'skills.title': 'Compétences',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.databases': 'Bases de Données',
    'skills.tools': 'Outils',
    
    // Projects
    'projects.title': 'Projets Phares',
    'projects.agromind.title': 'AgroMind AI',
    'projects.agromind.description': 'Plateforme IoT d\'agriculture intelligente',
    'projects.bricole.title': 'Bricole.ma',
    'projects.bricole.description': 'Marketplace connectant artisans et clients',
    'projects.sehati.title': 'Sehati',
    'projects.sehati.description': 'PWA médicale utilisant l\'IA et la Vision par Ordinateur',
    'projects.beinterim.title': 'Beinterim',
    'projects.beinterim.description': 'Plateforme Full Stack de recrutement',
    'projects.viewLive': 'Voir en Direct',
    
    // Timeline
    'timeline.title': 'Parcours',
    'timeline.2022': 'Classes Préparatoires Intégrées EMSI',
    'timeline.2024': 'Cycle Ingénieur en Informatique',
    'timeline.2024.internship': 'Stage Full Stack chez Beinterim',
    'timeline.2026.agromind': 'Projet AgroMind AI',
    'timeline.2026.bricole': 'Projet Bricole.ma',
    'timeline.2026.sehati': 'Projet Sehati',
    
    // Certifications
    'certifications.title': 'Certifications',
    'certifications.python': 'Python Data Science',
    'certifications.react': 'React Native',
    'certifications.agile': 'Agile Scrum',
    'certifications.cpp': 'C++ EPFL',
    
    // Contact
    'contact.title': 'Me Contacter',
    'contact.description': 'Discutons de votre prochain projet',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer',
  },
  en: {
    // Hero
    'hero.title': 'Younes Bakkali Terghi',
    'hero.subtitle1': 'Computer Engineering Student',
    'hero.subtitle2': 'Full Stack Developer & AI Enthusiast',
    'hero.description': 'Building intelligent software, AI-powered applications, and scalable architectures.',
    'hero.viewProjects': 'View Projects',
    'hero.downloadCV': 'Download CV',
    'hero.contact': 'Contact Me',
    
    // About
    'about.title': 'About',
    'about.description': 'Passionate Computer Engineering student specializing in Full Stack Development, Artificial Intelligence, and scalable architectures.',
    'about.projects': 'Projects',
    'about.technologies': 'Technologies',
    'about.years': 'Years learning',
    'about.certificates': 'Certificates',
    
    // Skills
    'skills.title': 'Skills',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.databases': 'Databases',
    'skills.tools': 'Tools',
    
    // Projects
    'projects.title': 'Featured Projects',
    'projects.agromind.title': 'AgroMind AI',
    'projects.agromind.description': 'Smart Agriculture IoT Platform',
    'projects.bricole.title': 'Bricole.ma',
    'projects.bricole.description': 'Marketplace connecting artisans and customers',
    'projects.sehati.title': 'Sehati',
    'projects.sehati.description': 'Medical PWA using AI and Computer Vision',
    'projects.beinterim.title': 'Beinterim',
    'projects.beinterim.description': 'Full Stack recruitment platform',
    'projects.viewLive': 'View Live',
    
    // Timeline
    'timeline.title': 'Journey',
    'timeline.2022': 'EMSI Integrated Classes',
    'timeline.2024': 'Computer Engineering',
    'timeline.2024.internship': 'Full Stack Internship at Beinterim',
    'timeline.2026.agromind': 'AgroMind AI Project',
    'timeline.2026.bricole': 'Bricole.ma Project',
    'timeline.2026.sehati': 'Sehati Project',
    
    // Certifications
    'certifications.title': 'Certifications',
    'certifications.python': 'Python Data Science',
    'certifications.react': 'React Native',
    'certifications.agile': 'Agile Scrum',
    'certifications.cpp': 'C++ EPFL',
    
    // Contact
    'contact.title': 'Get In Touch',
    'contact.description': 'Let\'s discuss your next project',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
